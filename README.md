<div align="center">

# SkyUI

**少一些噪音，多一些创造。**

一套面向个人创作的黑白 UI 组件库与交互式展示站。

用留白、细线和克制的层次建立统一的设计语言 —— 从一个按钮，到一整套 HTTP 状态页面。

[![React](https://img.shields.io/badge/React-19-202020?style=flat-square&logo=react&logoColor=202020)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-202020?style=flat-square&logo=typescript&logoColor=202020)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-202020?style=flat-square&logo=vite&logoColor=202020)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-202020?style=flat-square&logo=tailwindcss&logoColor=202020)](https://tailwindcss.com)

**37** 个组件与场景 · **2** 套主题 · **18** 种 HTTP 状态页面 · **0** 个组件依赖

[快速开始](#这是什么) · [组件地图](#组件地图) · [HTTP 页面](#http-状态页面) · [接入方式](#接入你的项目) · [本地运行](#本地运行)

</div>

---

## 这是什么

SkyUI 不是一个需要安装的组件库，而是一套**可以直接复制走**的黑白设计语言。

- **拿走即用** —— 点击「开始使用」下载 `ui.tsx` 和 `ui.css` 两个文件，扔进 React 项目就能跑，不需要装任何 npm 包。
- **不止于控件** —— 除了 12 个基础组件，还提供表单校验、分步表单、文件上传、数据表格、骨架屏等完整场景。
- **覆盖异常路径** —— 18 种 HTTP 状态页面（200 到 504），包含带倒计时重试的 429。
- **两套主题** —— 浅色与深色通过一个 CSS class 切换，所有组件自动跟随。
- **零图片资源** —— 所有几何视觉由 CSS 绘制，首屏没有一张外部图片要加载。

![SkyUI 组件画廊总览](docs/images/01-gallery-light.png)

> 上图：组件画廊首屏。左侧为设计系统导航，顶部支持 `⌘K` / `Ctrl+K` 快速搜索，
> 中部按 6 个分类（基础 / 表单 / 反馈 / 数据展示 / HTTP 页面 / 导航）筛选，支持网格与列表两种视图。

---

## 界面一览

### 概览页

设计宣言与项目统计，是进入组件库的入口页。

![概览页](docs/images/04-overview.png)

### 组件画廊 · 深色主题

右上角一键切换，所有组件与几何装饰同步反色，无需重新加载。

![深色主题下的组件画廊](docs/images/03-gallery-dark.png)

### 设计变量

色彩、圆角、间距三组变量，并支持一键导出为 JSON 设计规范。

![设计变量页](docs/images/05-tokens.png)

### 使用指南

三步接入流程：下载源码 → 引入组件 → 改写为你自己的设计语言。

![使用指南页](docs/images/06-guide.png)

---

## 组件地图

### 基础组件（4）

按钮、标签页、徽标与标签、折叠面板。按钮提供主要 / 次要 / 文字三种变体，以及禁用态与方形图标按钮。

### 表单场景（7）

输入框与错误态、选择控件（开关 / 复选 / 单选）、进度与滑块、联系表单字段校验、分步表单确认、偏好设置联动、文件选择与拖放校验。

![表单场景集合](docs/images/09-form-scenarios.png)

> 上图：表单分类下的 7 个场景。联系表单做了实时邮箱格式校验并把错误聚焦到字段；
> 分步表单包含基本信息的确认步骤；文件上传支持拖放，并校验类型与 5MB 大小上限。

### 反馈与状态（3）

通知条与 Toast、原生对话框、骨架屏 / 空状态 / 失败重试三态切换。

![反馈与状态集合](docs/images/12-feedback.png)

### 数据展示（4）

个人名片、数据概览（柱状趋势图）、头像组、数据表格（支持筛选、日期排序与分页）。

![数据展示集合](docs/images/11-data-display.png)

> 上图：数据展示分类。数据表格支持按标题与类型筛选、按更新时间排序，以及分页浏览。

---

## HTTP 状态页面

18 种状态码，从成功到服务器异常全覆盖。每张卡片都能打开大尺寸预览，体验页面内的主要操作。

![HTTP 状态页面集合](docs/images/10-http-pages.png)

| 分类 | 状态码 |
| --- | --- |
| **成功 2xx** | 200 OK · 201 Created · 202 Accepted · 204 No Content |
| **重定向 3xx** | 301 Moved Permanently |
| **客户端错误 4xx** | 400 · 401 · 403 · 404 · 408 · 409 · 410 · 422 · 429 |
| **服务器错误 5xx** | 500 · 502 · 503 · 504 |

**大尺寸页面预览**

<table>
<tr>
<td width="50%"><img src="docs/images/08-http-preview-404.png" alt="404 页面预览" /></td>
<td width="50%"><img src="docs/images/08-http-preview-429.png" alt="429 页面预览" /></td>
</tr>
<tr>
<td align="center"><em>404 —— 提供「返回首页」操作</em></td>
<td align="center"><em>429 —— 倒计时结束后可重试</em></td>
</tr>
</table>

组件通过 `actions` 属性接收你自己的导航与重试逻辑：

```tsx
<HttpStatusPage
  code={404}
  title="这一页，留白了"
  description="我们没有找到这个页面。也许地址有误，也许它已经搬家。"
  actions={<Button onClick={() => router.navigate({ to: '/' })}>返回首页</Button>}
/>
```

> 这些卡片只是**界面示例**：不会改变服务器的真实响应状态，也不会发送任何请求。
> 204 卡片展示的是客户端收到无正文响应后的确认界面，而不是 HTTP 响应正文本身。
> 站点另外配置了路由未匹配时的真实 404 页面，以及渲染异常时的错误回退界面。

---

## 接入你的项目

不需要安装任何组件依赖，只要 React 和一份样式文件。

### 第 1 步：下载源码

点击页面右上角的 **开始使用**，下载 `ui.tsx` 和 `ui.css`，放进同一个目录。

![下载对话框](docs/images/07-download-dialog.png)

> 需要完整场景（表单、表格、状态、导航）时，再下载 `scenarios.tsx` 和 `scenarios.css`，
> 四个文件放在同一目录。

### 第 2 步：引入组件

```tsx
import { Button, Input, Switch, Badge, Avatar, HttpStatusPage } from './components/ui'

<Button>开始创作</Button>
```

12 个基础组件可以独立复用，且**不需要 Lucide 图标库**：

`Button` · `Input` · `Switch` · `Badge` · `Avatar` · `Checkbox` · `Select` · `Textarea` · `Alert` · `Skeleton` · `EmptyState` · `HttpStatusPage`

需要完整场景时：

```tsx
import { ContactFormDemo, DataTableDemo, DataStatesDemo } from './components/scenarios'

<ContactFormDemo />
```

`scenarios.tsx` 另提供 `MultiStepFormDemo`、`SettingsFormDemo`、`UploadFieldDemo`、`NavigationDemo`、`HttpDemo` 与 `httpScenarios`。

### 第 3 步：改成你自己的设计

修改 `ui.css` 中的 `--skyui-*` 变量调整色彩、圆角和间距；在外层容器加 `skyui-theme-dark` 类即可启用深色主题。

所有下载内容都通过 Vite `?raw` 导出真实源码，**下载到的代码和仓库里的实现永远一致**。卡片上的代码预览是精简的使用参考，不是完整实现。

---

## 设计变量

| 类型 | 取值 |
| --- | --- |
| **色彩** | Paper `#ffffff` · Canvas `#f7f7f7` · Border `#e8e8e8` · Stone `#858585` · Ink `#202020` |
| **圆角** | 5px · 8px · 12px |
| **间距** | 4 · 8 · 12 · 16 · 24 · 32 · 48 |

设计变量页支持一键导出 JSON 格式的设计规范，方便交给其他工具继续使用。

---

## 响应式

侧边栏在窄屏下收起为抽屉式导航，画廊与表单场景保持单列可读。

![移动端视图](docs/images/13-mobile.png)

---

## 技术栈

React 19 · TypeScript · TanStack Start / Router · Vite 7 · Tailwind CSS 4 · Lucide 图标 · Netlify

页面主要使用自定义 CSS，几何视觉全部由 CSS 绘制，不依赖图片资源。对话框使用原生 `dialog.showModal()`，自带焦点限制、Escape 关闭与焦点还原。

---

## 本地运行

需要 **Node.js 22+** 和 **pnpm**。

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

默认开发地址为 `http://localhost:3000`。

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 Vite 开发服务器（端口 3000） |
| `pnpm build` | 生产构建，产物输出到 `dist/client` |

Netlify 部署配置位于 `netlify.toml`（构建命令 `vite build`，发布目录 `dist/client`）。

---

## 说明与边界

这是一套面向个人创作的设计系统展示，请留意它的边界：

- 所有展示数据都是**示例**。名片、访问量、订单等统计数字不是真实用户数据。
- 表单只做**本地校验**，不会发送邮件或提交到服务器；接入自己的项目时需另外实现真实提交逻辑。
- 文件选择**只读取**文件名、大小和类型，不读取文件内容，也不上传。
- 主题、开关、关注、表单和设置等交互只作用于**当前会话**，不做持久化写入。
- 项目中没有数据库、用户认证或服务端 API。

---

<div align="center">

**Less, but better.**

</div>