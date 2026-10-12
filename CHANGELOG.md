# Changelog

本项目的所有重要变更都记录在此文件中。
格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本遵循 [SemVer](https://semver.org/lang/zh-CN/)。

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
