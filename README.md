# skyui — 我的黑白设计系统

skyui 是一个面向个人创作的黑白 UI 组件库与交互式展示站。以留白、细线和克制的层次建立统一的设计语言，包含 37 个组件与场景示例、分类筛选、搜索、代码预览、浅色与深色主题，以及设计变量和使用指南。

## 场景覆盖

- 基础交互：按钮、输入框、开关、标签、头像、标签页、折叠面板和原生对话框。
- 表单场景：联系表单的字段校验与错误聚焦、带确认步骤的分步表单、联动偏好设置，以及文件选择、拖放、类型与大小校验。
- HTTP 页面：200、201、202、204、301、400、401、403、404、408、409、410、422、429、500、502、503、504。可打开大尺寸页面预览并体验主要操作，429 示例包含倒计时重试。
- 数据与反馈：骨架屏、空状态、错误重试、成功反馈，以及支持筛选、日期排序和分页的数据表格。
- 导航：面包屑和分页的本地交互示例。

画廊中的 HTTP 页面是界面示例，不会改变服务器响应状态或发送真实请求。204 卡片展示的是客户端收到无正文响应后的确认界面，而不是 HTTP 响应正文。站点另外配置了路由未匹配时的 404 页面和渲染异常时的错误回退界面。

## 技术

React 19、TypeScript、TanStack Start / Router、Vite、Tailwind CSS 4、Lucide 图标和 Netlify。页面主要使用自定义 CSS，几何视觉由 CSS 绘制，不依赖图片资源。

## 本地运行

需要 Node.js 22+ 和 pnpm。

```bash
pnpm install
pnpm dev
```

默认开发地址为 `http://localhost:3000`。Netlify 部署设置位于 `netlify.toml`。

## 使用组件

在站点点击「开始使用」，分别下载 `ui.tsx` 和 `ui.css`，将两个文件放在 React + TypeScript 项目的同一目录，然后导入：

```tsx
import { Button, Input, Switch, Badge, Avatar, HttpStatusPage } from './components/ui'

<Button>开始创作</Button>
```

12 个基础组件可以独立复用，无需 Lucide：`Button`、`Input`、`Switch`、`Badge`、`Avatar`、`Checkbox`、`Select`、`Textarea`、`Alert`、`Skeleton`、`EmptyState` 和 `HttpStatusPage`。表单字段支持关联标签与错误提示；HTTP 页面可通过 `actions` 传入应用自己的导航或重试行为。

若需要完整场景，另外下载 `scenarios.tsx` 和 `scenarios.css`，与 `ui.tsx`、`ui.css` 放在同一个目录，再导入：

```tsx
import { ContactFormDemo, DataTableDemo, DataStatesDemo } from './components/scenarios'

<ContactFormDemo />
```

`scenarios.tsx` 还提供 `MultiStepFormDemo`、`SettingsFormDemo`、`UploadFieldDemo`、`NavigationDemo`、`HttpDemo` 和 `httpScenarios`。所有下载都通过 Vite `?raw` 导出实际源码。卡片代码预览是精简使用参考，不是完整实现。

在 `ui.css` 修改 `--skyui-*` 变量以自定义设计；在容器添加 `skyui-theme-dark` 类启用深色主题。设计变量页可导出 JSON 设计规范。

所有展示数据均为示例。主题、开关、关注、表单和设置等交互只用于当前会话预览，不涉及真实账户或持久化写入。联系表单不会发送邮件，文件选择只读取文件名、大小和类型，不读取文件内容或上传。接入自己的项目时，需要另外实现真实提交、认证、文件存储或服务状态查询。
