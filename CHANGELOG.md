# Changelog

本项目的所有重要变更都记录在此文件中。
格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## [1.4.0] - 2026-10-13

本次迭代的主线：**补齐数据展示能力**。此前 66 个导出已覆盖通用 UI 与浮层表单，但图表与指标类几乎为零 —— 展示站「数据概览」里的图形是写死的 CSS 柱状 div，使用者要做看板必须自行从零实现折线图、趋势线与水位可视化。本版本新增 8 个零依赖组件，并建立版本号单一来源机制。

### Added 新增

**图表与指标（8）**

- `Sparkline` 迷你趋势线（表格行内嵌走势，无坐标轴无交互；数据不足时降级为占位符）。
- `LineChart` 折线趋势图（多序列、网格线、虚实图例、首尾时间标注；等值序列保留上下留白，不退化成贴边直线）。
- `Gauge` 环形仪表（适合占比 / 完成度；超量程按比例截断而非溢出）。
- `Meter` 阈值水位条（在进度条上标出分级刻度）。
- `Counter` 数字滚动（尊重 `prefers-reduced-motion`）。
- `ThresholdLegend` 阈值分级图例（如 60% 容量评估 / 80% 扩容执行 / 90% 紧急处置）。
- `SearchInput` 搜索框（带一键清空）。
- `FilterChips` 单选分类筛选胶囊（带 `aria-pressed` 语义）。

全部手写 SVG / CSS，不引入图表库，仅使用既有 `--skyui-*` 变量，未新增任何颜色。

### Infrastructure 工程

- **版本号单一来源**：新增 `src/version.ts` 导出 `VERSION` / `VERSION_SHORT` / `COMPONENT_COUNT`；`index.tsx` 中原先6 处硬编码版本号全部改为引用常量。
- **版本一致性校验**：新增 `pnpm check:version`，强制 `package.json` / `src/version.ts` / `CHANGELOG.md` / `README.md` 四者同步，并禁止源码中再次出现硬编码版本号（对示例代码字符串做了显式豁免）。此前版本号散落 10 余处、手工同步极易漏改。
- **截图流程可复现**：新增 `pnpm capture`，用Playwright 按 README 示意图清单批量截图，产物直接写入 `docs/images/`。
- 测试 31 → **41 个用例**，新增 10 个覆盖超量程截断、等值序列、空数据降级、键盘交互与 ARIA 语义。
- 展示站新增 5 张组件卡片（折线趋势图 / 迷你趋势线 / 仪表与水位 / 数字滚动 / 搜索与筛选），归入既有「数据展示」分类，卡片总数 61 → **66**。
- README 全部界面示意图重新截取，同步 v1.4.0 的界面状态。

### 向后兼容

既有组件的 props 与行为**完全未改动**，v1.3.0 用法无需任何修改。新增组件为纯增量。

## [1.3.0] - 2026-10-12

本次迭代的主线：**从「控件集合」升级为「自洽的设计语言」**。新增排版、容器、命令面板、日期选择等 24 个导出（组件与工具 34 → 58），展示站画廊 46 → 61 张卡片，`⌘K` 从「聚焦搜索框」升级为真正的命令面板。

### Added 新增

**排版与容器（6）**

- `Title`（h1~h4 四级标题）、`Text`（secondary / muted / strong / code / mark / underline / strikethrough）、`Paragraph`、`Kbd` —— 设计语言的核心载体，此前全靠裸 HTML 标签。
- `Card` 卡片容器（标题栏 / 内容区 / 页脚，`hoverable` / `padded` 开关）。
- `Label` 表单标签（`required` 必填星号）。

**选择控件（5）**

- `Segmented` 分段控件（画廊「分类 tabs」与「网格 / 列表视图切换」的组件化）。
- `RadioGroup` 单选组（`SettingsFormDemo` 的原生 radio 已替换）。
- `Toggle` / `ToggleGroup` 双态按钮与按钮组。
- `Rate` 星级评分（重复点击同一颗星可清除）。

**浮层扩展与加载（3）**

- `Popover` 气泡卡片（受控 / 非受控双模式，Escape 与外部点击关闭）。
- `HoverCard` 悬停卡片（悬停 / 键盘聚焦，纯 CSS 驱动）。
- `Spin` 独立加载指示器。

**表单抽象（2）**

- `useForm` 校验 hook（`required` / `pattern` / `min` / `max` 规则，提交时全量校验）。
- `FormItem` 表单项包装（错误输出 `role="alert"`）。

**命令面板（1）**

- `Command`：基于 `Modal` 的命令面板，输入过滤、↑↓ 导航、Enter 选择；展示站 `⌘K` 已接入（页面导航 / 主题切换 / 下载源码 / 预览 404）。

**日期（2）**

- `Calendar` 月历（周一起始、键盘导航、`minDate` / `maxDate` 禁用）。
- `DatePicker` 日期选择器（输入框 + Popover + Calendar）。

**展示与布局（5）**

- `Carousel` 轮播（`autoPlay`、箭头、指示点）。
- `Grid` / `GridItem` 栅格布局（`span` 按父级列数自动裁剪）。
- `ConfigProvider` / `useSkyUIConfig` 全局配置（主题类 + 默认尺寸，`Button` 已接入）。

### Enhanced 增强

- `Table` 新增 `loading`（骨架行）、`sticky`（粘性表头）、`expandable`（行展开）三个 props。
- `Button` 的 `size` 改为可选，缺省时读取 `ConfigProvider` 注入的默认尺寸。
- 展示站：画廊新增 15 张卡片（46 → 61），`SettingsFormDemo` 改用 `RadioGroup`，下载对话框与更新日志同步至 58 个组件口径。

### Infrastructure 工程

- 测试 12 → 31 个用例，覆盖全部新组件（含 Calendar 键盘导航、useForm 校验流程、Command 过滤选择）。
- 新增 `src/test-setup.ts`：为 jsdom 补齐 `HTMLDialogElement` polyfill（jsdom 未实现 `showModal` / `close`），使基于原生 `dialog` 的组件可测试。
- 测试文件显式 `afterEach(cleanup)`，消除跨用例渲染累积。

## [1.2.1] - 2026-10-12

### Removed 移除

- 移除 Netlify 部署耦合：删除 `netlify.toml`、`@netlify/vite-plugin-tanstack-start` 依赖及其 Vite 插件接入。
- 构建产物为 `dist/client`（客户端）+ `dist/server`（SSR），部署平台中立 —— Vercel / Cloudflare / Netlify / 自建 Node 服务器均可接入。
- 同步更新 README、AGENTS.md 与 `.gitignore` 中的 Netlify 相关描述。

### 向后兼容

组件本身（`ui.tsx` / `ui.css` / `scenarios.*`）无任何改动，v1.2.0 用法完全兼容。

## [1.2.0] - 2026-10-12

本次迭代的主线：**画廊看到的东西，全部拿得走**。此前只存在于展示站里的 Tabs、Accordion、Dialog、Toast 等组件全部收编进 `ui.tsx` 下载包，并补齐浮层类标配与数据展示组件。

### Added 新增

- **浮层组件（5）**：`Tooltip`（纯 CSS，悬停 / 键盘聚焦显示）、`Dropdown`（菜单，外点与 Escape 关闭）、`Modal`（原生 `dialog.showModal()`，焦点还原）、`Drawer`（左 / 右 / 底三向抽屉）、`ToastProvider` + `useToast`（命令式调用、队列、自动消失）。
- **导航组件（5）**：`Tabs`、`Accordion`（单开 / 多开）、`Breadcrumb`、`Pagination`（窗口化页码）、`Steps`。
- **数据展示（7）**：`Progress`、`Slider`、`AvatarGroup`（+N 溢出）、`Tag`（可移除）、`Table`（columns 配置式 API）、`Statistic`、`Timeline`、`Descriptions`。
- **布局（3）**：`Divider`（水平 / 垂直 / 带文案）、`Stack`、`Container`。
- 画廊新增 9 张组件卡片（Tooltip / Dropdown / Drawer / Divider / Mini Table / Statistic / Timeline / Descriptions / Steps），总数 37 → 46；Tabs、Accordion、Progress & Slider、Avatars、Badges、Data Overview、Dialog 等卡片改为直接使用 `ui.tsx` 组件渲染。
- `scenarios.tsx` 的 `MultiStepFormDemo` / `DataTableDemo` / `NavigationDemo` 改用 `Steps` / `Table` / `Breadcrumb` + `Pagination` 组件实现，样式上移至 `ui.css`（`.skyui-steps` / `.skyui-table*` / `.skyui-pagination` / `.skyui-breadcrumb`）。

### Changed 变更

- `Button`：新增 `size`（sm / md / lg）与 `loading`（内置 spinner、`aria-busy`、自动禁用）。
- `Input`：新增 `prefix` / `suffix` 前后缀插槽（组合为带边框输入组）。
- `Avatar`：新增 `src` 图片支持（加载失败自动回退首字符）与 `status`（online / busy / offline 状态点）。
- `Checkbox`：新增 `indeterminate` 半选态。
- `Alert`：新增 `dismissible` / `onClose` 可关闭。
- `Skeleton`：新增 `variant`（text / circle / rect）。
- 所有新增交互遵循既有约定：不依赖图标库、中文文案、`--skyui-*` 变量驱动、支持深色主题、尊重 `prefers-reduced-motion`。

### 工程化

- 新增 `vitest` + `@testing-library/react` 测试基建（12 个用例覆盖新增与增强组件），`pnpm test`。
- 新增 `pnpm typecheck` 脚本与 GitHub Actions CI（install → typecheck → test → build）。
- 新增 `CONTRIBUTING.md`、Issue 模板、`docs/components.md` 组件 API 参考同步更新。

### 向后兼容

`12` 个既有组件的既有 props 全部保留，v1.1.0 用法无需改动。

## [1.1.0] - 2026-10-12

- 重写 README：徽章、锚点导航、界面一览 / 组件地图 / HTTP 页面 / 接入方式结构，新增 13 张界面截图。
- HTTP 状态码按 2xx / 3xx / 4xx / 5xx 分类；新增说明与边界章节。
- `.gitignore` 补充 `node_modules`、`dist` 与 `routeTree.gen.ts`。

## [1.0.0] - 2026-10-12

- 首个公开版本：12 个基础组件、7 个完整场景、18 种 HTTP 状态页面、浅色 / 深色双主题、零组件依赖。
