/**
 * README 界面示意图批量截图。
 *
 * 组件有变化时重新生成，避免 README 截图与实际界脱节 ——
 * v1.3.0 的截图里「数据概览」还是 CSS 柱状 div，看不到任何真实图表。
 *
 * 用法：
 *   pnpm capture          需先pnpm build 并另行启动预览服务
 *   BASE_URL=... pnpm capture   对已部署的站点截图
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'docs', 'images')
const base = process.env.BASE_URL || 'http://127.0.0.1:4190'

mkdirSync(outDir, { recursive: true })

/**
 * 每一项：文件名、页面、视口、操作。
 * clickText 用于点击分类 tab 或按钮后再截图。
 */
const ALL_SHOTS = [
  { file: '01-gallery-light.png', page: '组件', width: 1440, height: 1080 },
  { file: '03-gallery-dark.png', page: '组件', width: 1440, height: 1080, dark: true },
  { file: '04-overview.png', page: '概览', width: 1440, height: 900 },
  { file: '05-tokens.png', page: '设计变量', width: 1440, height: 1000 },
  { file: '06-guide.png', page: '使用指南', width: 1440, height: 1000 },
  // 数据展示分类 —— 本次新增图表组件的主要展示位
  { file: '11-data-display.png', page: '组件', width: 1440, height: 1200, clickText: '数据展示', settle: 1600 },
  { file: '11b-charts.png', page: '组件', width: 1440, height: 900, category: '数据展示', scrollTo: 'LineChart', settle: 1600 },
  { file: '11c-gauges.png', page: '组件', width: 1440, height: 760, category: '数据展示', scrollTo: 'Gauge & Meter', settle: 1600 },
  { file: '09-form-scenarios.png', page: '组件', width: 1440, height: 1100, clickText: '表单场景', settle: 1200 },
  { file: '12-feedback.png', page: '组件', width: 1440, height: 1100, clickText: '反馈与状态', settle: 1200 },
  { file: '10-http-pages.png', page: '组件', width: 1440, height: 1200, clickText: 'HTTP 与错误页面', settle: 1200 },
  { file: '07-download-dialog.png', page: '组件', width: 1440, height: 900, dialog: 'download' },
  { file: '13-mobile.png', page: '组件', width: 430, height: 900 },
]

// 支持只重跑部分：SHOT_FILTER=mobile,charts pnpm capture
const shots = process.env.SHOT_FILTER
  ? ALL_SHOTS.filter(s => process.env.SHOT_FILTER.split(',').some(f => s.file.includes(f)))
  : ALL_SHOTS

const browser = await chromium.launch()

async function navigate(page, label) {
  // 窄视口下侧边栏收起，需先打开汉堡菜单
  const menuButton = page.getByRole('button', { name: '打开导航' })
  if (await menuButton.isVisible().catch(() => false)) {
    await menuButton.click()
    await page.waitForTimeout(500)
  }
  // 展示站是单路由 + 内部状态，用侧边栏按钮切页
  await page.getByRole('button', { name: label, exact: false }).first().click()
  await page.waitForTimeout(600)
  const close = page.getByRole('button', { name: '关闭导航' })
  if (await close.isVisible().catch(() => false)) await close.click()
}

async function setCategory(page, label) {
  const tab = page.getByRole('button', { name: new RegExp(`^${label}`) }).last()
  await tab.click()
  await page.waitForTimeout(600)
}

let failed = 0
for (const shot of shots) {
  const context = await browser.newContext({
    viewport: { width: shot.width, height: shot.height },
    deviceScaleFactor: 2,
    colorScheme: shot.dark ? 'dark' : 'light',
  })
  const page = await context.newPage()
  try {
    await page.goto(base, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)

    if (shot.dark) {
      await page.getByRole('button', { name: /切换深色主题|切换浅色主题/ }).first().click()
      await page.waitForTimeout(500)
    }
    await navigate(page, shot.page)

    if (shot.clickText) await setCategory(page, shot.clickText)
    if (shot.category) await setCategory(page, shot.category)

    if (shot.scrollTo) {
      const card = page.locator('.component-card').filter({ hasText: shot.scrollTo }).first()
      await card.scrollIntoViewIfNeeded()
      await page.evaluate(() => window.scrollBy(0, -110))
      await page.waitForTimeout(400)
    }
    if (shot.dialog === 'download') {
      await page.getByRole('button', { name: /开始使用/ }).first().click()
      await page.waitForTimeout(700)
    }
    if (shot.settle) await page.waitForTimeout(shot.settle)

    await page.screenshot({ path: join(outDir, shot.file) })
    console.log(`✓ ${shot.file}`)
  } catch (error) {
    failed += 1
    console.error(`✗ ${shot.file} — ${error.message.split('\n')[0]}`)
  }
  await context.close()
}

await browser.close()
console.log(failed ? `\n${failed} 张截图失败` : `\n全部 ${shots.length} 张截图完成 → docs/images/`)
process.exit(failed ? 1 : 0)