/**
 * 版本一致性校验。
 *
 * 发版前运行，防止版本号在多个文件间漂移。
 * 过去 v1.3 散落在 index.tsx 的 6 处、README 与 CHANGELOG 若干处，
 * 手工同步极易漏改；现在 package.json 与 src/version.ts 为双事实来源，
 * 本脚本强制二者一致，并校验 CHANGELOG 与 README 徽章同步。
 *
 * 用法：pnpm check:version
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (...parts) => readFileSync(join(root, ...parts), 'utf8')

const errors = []
const warn = []

// 1. package.json 与 src/version.ts 必须一致
const pkg = JSON.parse(read('package.json'))
const versionSource = read('src', 'version.ts')
const declared = /export const VERSION = '([^']+)'/.exec(versionSource)?.[1]

if (!declared) {
  errors.push('src/version.ts 中未找到 VERSION 常量')
} else if (declared !== pkg.version) {
  errors.push(`版本不一致：package.json 为 ${pkg.version}，src/version.ts 为 ${declared}`)
}

// 2. CHANGELOG 必须有当前版本的条目
const changelog = read('CHANGELOG.md')
if (declared && !changelog.includes(`## [${declared}]`)) {
  errors.push(`CHANGELOG.md 缺少 [${declared}] 版本条目`)
}

// 3. 源码中不应再有硬编码版本号（应统一走 src/version.ts）
// 豁免两类误报：
//   a) snippets 里的字符串是「展示给用户看的示例代码」，本就该是字面量
//   b) 409 冲突场景的业务文案（讲的是资源版本冲突，与组件库版本无关）
const EXEMPT = [
  /^\s*Timeline:/,
  /title: 'Tabs'/,
  /code: 409/,
]
const filesToScan = ['src/routes/index.tsx', 'src/components/scenarios.tsx']
for (const file of filesToScan) {
  const source = read(...file.split('/'))
  const hits = source.split('\n').filter(line => {
    if (line.includes('version.ts') || line.includes('VERSION_SHORT') || line.includes('{VERSION}')) return false
    if (EXEMPT.some(pattern => pattern.test(line))) return false
    return /v1\.\d+(\.\d+)?/.test(line)
  })
  if (hits.length) {
    errors.push(`${file} 仍有硬编码版本号 ${hits.length} 处，应改为引用 src/version.ts：\n    ${hits.map(h => h.trim().slice(0, 90)).join('\n    ')}`)
  }
}

// 4. README 组件计数应与 version.ts 一致
const readme = read('README.md')
const countSource = /export const COMPONENT_COUNT = (\d+)/.exec(versionSource)?.[1]
if (countSource) {
  const actual = (read('src/components/ui.tsx').match(/export function/g) || []).length
  if (String(actual) !== countSource) {
    errors.push(`组件计数不一致：version.ts 声明 ${countSource}，ui.tsx 实际导出 ${actual}`)
  }
  const stale = [...readme.matchAll(/(\d+) 个组件与工具/g)].map(m => m[1]).filter(n => n !== countSource)
  if (stale.length) {
    errors.push(`README 组件计数未同步：发现 ${stale.join(' / ')}，应为 ${countSource}`)
  }
}

// 5. 软提醒：README 截图可能过期
const imageDir = join(root, 'docs', 'images')
let oldest = null
try {
  const { readdirSync, statSync } = await import('node:fs')
  for (const name of readdirSync(imageDir)) {
    const mtime = statSync(join(imageDir, name)).mtimeMs
    if (!oldest || mtime < oldest) oldest = mtime
  }
} catch {
  warn.push('未找到 docs/images 目录，跳过截图新鲜度检查')
}
if (oldest && Date.now() - oldest > 30 * 24 * 3600 * 1000) {
  const days = Math.round((Date.now() - oldest) / (24 * 3600 * 1000))
  warn.push(`docs/images 中最旧的截图已是 ${days} 天前的，若组件有变化建议重新截取`)
}

// 输出
for (const message of warn) console.warn(`⚠️  ${message}`)
if (errors.length) {
  console.error(`\n✗ 版本校验未通过（${errors.length} 项）：\n`)
  errors.forEach((message, index) => console.error(`${index + 1}. ${message}\n`))
  process.exit(1)
}
console.log(`✓ 版本校验通过：v${pkg.version} · package.json / version.ts / CHANGELOG / README 已同步`)