# skyui 项目说明

## 架构

这是一个 TanStack Start + React 19 + TypeScript 的个人黑白组件库，部署平台无关（构建产物为 `dist/client` + `dist/server`）。首页呈现组件画廊，而非模板分析看板。导航切换概览、组件、设计变量和使用指南；这些是同一路由内的展示视图。

## 关键目录

- `src/routes/index.tsx`：画廊、示例交互、搜索、分类、源码下载和原生对话框。
- `src/routes/__root.tsx`：中文文档结构、站点名称和分享元数据。
- `src/components/ui.tsx`：12 个独立基础组件，包括表单元素、Alert、Skeleton、EmptyState 和 HttpStatusPage。
- `src/components/ui.css`：基础组件样式、`--skyui-*` 变量和主题。
- `src/components/scenarios.tsx` / `src/components/scenarios.css`：完整表单、HTTP 页面预览、数据状态、表格和导航交互示例及配套样式。
- `public/skyui.svg`：skyui 品牌图标。
- `src/styles.css`：展示站布局、响应式断点、几何装饰和动画。
- `src/router.tsx`：TanStack Router 配置。
- `vite.config.ts`：Vite 与框架构建配置。

## 约定

使用 PascalCase 组件和 camelCase 状态，保持严格 TypeScript。不要引入不必要的状态管理或组件依赖。UI 保持中文文案、黑白灰色彩、清晰焦点与键盘可用性。基础组件保持无需图标依赖，以便用户下载复用。

展示状态只在当前会话存在；所有名片和统计数据都是示例，不是真实用户数据。表单仅在本地校验，文件仅展示名称、类型和大小，不上传、不读取内容。没有数据库、认证、向服务器提交的表单或服务器 API。HTTP 卡片仅预览界面，不改变 HTTP 响应状态；根路由提供真实的未匹配页面与渲染错误回退。若未来加入真实持久化，使用所选部署平台提供的能力。

源码通过 Vite `?raw` 导入，使下载内容与实际基础组件和场景组件始终一致。基础组件需下载 ui.tsx 和 ui.css；完整场景需再下载 scenarios.tsx 和 scenarios.css，四个文件放在同一目录。组合卡片的代码片段只是使用参考，不是完整组件实现。画廊总数和分类计数从卡片集合派生，不要写死。

## 以编程方式获取组件源码（供 AI 工具与脚本）

组件源码在仓库内的固定路径：`src/components/`（ui.tsx、ui.css、scenarios.tsx、scenarios.css）。代理工具接入本库时不要依赖展示站的下载按钮，直接用以下命令或 raw 链接：

```bash
npx degit SkyBiuBiu/imskyui/src/components src/components
```

逐文件下载：`https://raw.githubusercontent.com/SkyBiuBiu/imskyui/main/src/components/<file>`（把 `main` 换成 release tag 可锁定版本）。每个组件的 props 签名见 `docs/components.md`，与源码保持同步；修改组件后必须同步更新该文档和两份 README 的接入说明。许可证为 MIT（见 LICENSE）。

对话框使用原生 `dialog.showModal()`，提供焦点限制、Escape 关闭与关闭后焦点还原。使用 CSS 绘制视觉资产，无需图像服务。尊重 `prefers-reduced-motion`。

不要手动编辑生成的 `routeTree.gen.ts`。不要在自动代理任务中启动开发服务或运行构建、类型检查、测试；部署流水线负责验证。
