/**
 * 一键发版：校验 → 打 tag → 推送 → 创建 GitHub Release。
 *
 * 过去发版是纯手工的：先跑一遍校验，再手打 tag、push，
 * 然后去网页上复制 CHANGELOG 段落粘贴进 Release 说明。
 * 步骤多且互相独立，最容易出的错是「tag 打了但校验没过」，
 * 或者「Release 说明忘了同步 CHANGELOG」。
 *
 * 本脚本把四步串成一条命令，并从 CHANGELOG.md 中
 * **自动抽取当前版本的段落**作为 Release 正文 —— CHANGELOG 是唯一事实来源，
 * 不再需要人工复制粘贴。
 *
 * 用法：
 *   pnpm release --dry-run     只跑校验并打印将要执行的动作，不落地
 *   pnpm release               正式发版
 *   pnpm release --draft       创建草稿 Release（不自动发布）
 *
 * 前置条件：工作区干净、当前在 main、gh 已登录、版本校验通过。
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const draft = args.includes('--draft')

const log = (msg) => console.log(msg)
const step = (n, total, msg) => log(`\n[${n}/${total}] ${msg}`)

/**
 * Windows 上 pnpm 是 pnpm.cmd shim。Node 20+ 出于安全默认禁止不经 shell 直接
 * spawn .cmd（会抛 EINVAL/ENOENT），因此只有 pnpm 需要 shell: true。
 * git 与 gh 是真实 exe，直接传 argv 更安全 —— tag message 里带中文和换行，
 * 走 shell 会被引号规则破坏。
 */
const SHELL_COMMANDS = new Set(['pnpm'])

/**
 * 执行命令。
 * readonly=true 的命令（读分支、读状态、查 tag、gh auth）不产生任何副作用，
 * dry-run 下也照常执行 —— 否则校验逻辑会因为拿不到数据而误判。
 * 只读=false 的命令在 dry-run 下只打印不执行。
 */
function run(command, commandArgs, { capture = false, readonly = false } = {}) {
  if (dryRun && !readonly) {
    log(`   [dry-run] ${command} ${commandArgs.join(' ')}`)
    return capture ? '' : null
  }
  return execFileSync(command, commandArgs, {
    cwd: root,
    encoding: 'utf8',
    shell: SHELL_COMMANDS.has(command),
    stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  })
}

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const version = pkg.version
const tag = `v${version}`
const TOTAL = 5

log(`\n发布 ${tag}（skyui-design-system ${version}）${dryRun ? '—— dry-run，不会产生任何变更' : ''}`)

// ---------------------------------------------------------------- 前置检查
step(1, TOTAL, '前置检查')

const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { capture: true, readonly: true })?.trim()
if (branch !== 'main') {
  console.error(`✗ 当前分支为 ${branch}，发版必须在 main 上进行`)
  process.exit(1)
}
log(`✓ 分支 main`)

const status = run('git', ['status', '--porcelain'], { capture: true, readonly: true })?.trim()
if (status) {
  console.error(`✗ 工作区不干净，请先提交或暂存：\n${status}`)
  process.exit(1)
}
log(`✓ 工作区干净`)

// tag 已存在时不做任何事，直接指向 Release，避免重复发版
const existingTag = run('git', ['tag', '--list', tag], { capture: true, readonly: true })?.trim()
if (existingTag) {
  log(`! tag ${tag} 已存在，跳过打 tag 步骤`)
}

try {
  const auth = run('gh', ['auth', 'status'], { capture: true, readonly: true })
  const user = /Logged in to github\.com account (\S+)/.exec(auth || '')?.[1]
  log(`✓ gh 已登录${user ? `（${user}）` : ''}`)
} catch {
  console.error('✗ gh 未登录，请先执行 gh auth login')
  process.exit(1)
}

// ---------------------------------------------------------- 抽取 CHANGELOG
const changelog = readFileSync(join(root, 'CHANGELOG.md'), 'utf8')

/**
 * 抽取 `## [1.4.0] - 2026-10-13` 到下一个 `## [` 之间的内容。
 * 顺带把标题行去掉 —— Release 说明里版本号已经在标题中，重复一次很怪。
 *
 * 按标题行切分而不是用带 \Z 的正则：JS 的 \Z 是字面量 Z 而非结尾锚点，
 * 用 lookahead 结尾会静默失配，抽不出任何内容。
 */
function extractChangelogSection(md, ver) {
  const sections = md.split(/^## /m).slice(1)
  const section = sections.find(s => s.startsWith(`[${ver}]`))
  if (!section) return null
  const body = section.slice(section.indexOf('\n') + 1).trim()
  return body.replace(/\n{3,}/g, '\n\n').trim()
}

const notes = extractChangelogSection(changelog, version)
if (!notes) {
  console.error(`✗ CHANGELOG.md 中找不到 [${version}] 的段落，无法自动生成 Release 说明`)
  console.error('  请先补写 CHANGELOG，再执行 pnpm release（版本校验本就会拦这一步）')
  process.exit(1)
}
log(`✓ CHANGELOG 中已定位 [${version}] 段落（${notes.length} 字符，将作为 Release 正文）`)

// ------------------------------------------------------------ 完整校验
step(2, TOTAL, '校验（版本一致性 + 类型 + 测试 + 构建）')
run('pnpm', ['release:check'])

// ---------------------------------------------------------------- 打 tag
step(3, TOTAL, `打 annotated tag ${tag}`)
if (existingTag) {
  log(`   跳过（已存在）`)
} else {
  const title = changelog.match(new RegExp(`^## \\[${version.replace(/\./g, '\\.')}\\] - (\\S+)`))?.[1]
  const message = [
    `${tag}${title ? ` (${title})` : ''}`,
    '',
    notes.split('\n').slice(0, 6).join('\n'),
  ].join('\n')
  run('git', ['tag', '-a', tag, '-m', message])
  run('git', ['push', 'origin', tag])
  log(`✓ ${tag} 已创建并推送`)
}

// ---------------------------------------------------------- GitHub Release
step(4, TOTAL, `创建 GitHub Release${draft ? '（草稿）' : ''}`)
const releaseArgs = ['release', 'create', tag, '--title', tag, '--notes-file', '-']
if (draft) releaseArgs.push('--draft')
// 不加 --generate-notes：CHANGELOG 段落已经是精心写过的人写正文，
// 再自动追加一份 compare 链接列表只会稀释信息量

if (dryRun) {
  log(`   [dry-run] gh ${releaseArgs.join(' ')}`)
  log('   [dry-run] Release 正文为上方 CHANGELOG 段落')
} else {
  // 正文通过 stdin 传入，避免中文与换行在参数传递中被转义破坏
  execFileSync('gh', releaseArgs, { cwd: root, input: notes, stdio: ['pipe', 'inherit', 'inherit'] })
  log(`✓ Release 已创建：${run('gh', ['release', 'view', tag, '--json', 'url', '-q', '.url'], { capture: true, readonly: true })?.trim() || ''}`)
}

// ---------------------------------------------------------------- 收尾
step(5, TOTAL, '推送后的建议')
log(`· 查看 Release：gh release view ${tag}`)
log(`· 如需撤销：git tag -d ${tag} && git push origin :${tag} && gh release delete ${tag}`)
log(`\n${dryRun ? 'dry-run 完成，未产生任何变更。' : `✓ ${tag} 发布完成`}\n`)