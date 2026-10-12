# Changelog

本项目的所有重要变更都记录在此文件中。
格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本遵循 [SemVer](https://semver.org/lang/zh-CN/)。

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
