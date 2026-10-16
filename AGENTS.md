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
- `.github/workflows/pages.yml`：GitHub Pages 演示站部署工作流（push main 触发），详见文末「GitHub Pages 演示站」。
- `public/404.html`：Pages 404 回退页，独立静态页，禁止用 index.html 副本替代。

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

## GitHub Pages 演示站

在线地址：<https://skybiubiu.github.io/imskyui/>（GitHub 仓库 About 的 homepage 指向此处）。Pages 只托管静态文件，这条链路与 Vercel / Cloudflare / Netlify 的 SSR 部署相互独立，改动其一不影响其余。

### 部署链路

1. **构建**：`pnpm build:pages`，内部为 `DEPLOY_TARGET=github-pages vite build`。`vite.config.ts` 在该 `DEPLOY_TARGET` 下注入 `base: '/imskyui/'` 并开启 TanStack Start 预渲染；应用是单路由，预渲染后唯一路由固化为静态 HTML，产物全部落在 `dist/client`（SSR 产物 `dist/server` 不上传）。其他 `DEPLOY_TARGET` 的构建行为不变。
2. **部署**：`.github/workflows/pages.yml`，push 到 main 触发。步骤为 checkout → pnpm/action-setup（version 9，仓库未声明 `packageManager` 字段，必须显式指定）→ setup-node（node 22，cache: pnpm）→ `pnpm install --frozen-lockfile` → `pnpm build:pages` → 写 `.nojekyll` → configure-pages → upload-pages-artifact → deploy-pages。无需任何 secret，权限来自 job 级 `permissions`；`concurrency.group: pages` 保证同一时间只有一个部署。
3. **启用**：仓库 Pages 只需开启一次（`build_type=workflow`）。若未启用：`gh api -X POST repos/SkyBiuBiu/imskyui/pages -f build_type=workflow`。

### 硬性规则

- `public/404.html` 是独立静态页（内联样式、无脚本），未匹配路径由 GitHub Pages 直接返回。**不要**改回 `cp dist/client/index.html dist/client/404.html`：客户端路由器会按当前路径渲染站内 404，与服务端画廊 HTML 不一致，触发 React #418 整树重建和内容闪烁。
- base 是 `/imskyui/`：源码里的站内链接和 favicon 必须用相对路径（`src/routes/index.tsx` 的品牌链接、`src/routes/__root.tsx` 的 favicon），不要写死 `/`。
- 预渲染 HTML 必须是有效 HTML：嵌套 `<button>` 等无效结构会直接导致水合失败。典型场景是 Popover 的 trigger 传入 `<Button>` 这类渲染出 button 的组件——Popover 克隆注入交互属性而不是再包一层 button（见 `src/components/ui.tsx` 与对应单测）。新增或修改组件后按下面的方法自查。
- 改动 `vite.config.ts`、`.github/workflows/pages.yml`、`public/404.html` 属于「不在自动代理任务中运行构建」约定的例外：推送前必须本地验证。

### 推送前本地验证

```bash
pnpm build:pages
```

然后模拟 `/imskyui/` 子路径伺服 `dist/client`，做浏览器级检查：

1. 把 `dist/client` 复制进临时目录的 `imskyui/` 子目录，静态服务器根目录设为该临时目录，访问 `http://127.0.0.1:<port>/imskyui/`。直接伺服 `dist/client` 根路径不等价——base 不匹配。
2. 检查项：资源全部 200；无 console pageerror；水合无 React #418；主题切换、搜索筛选、导航、`⌘K` 命令面板、HTTP 预览弹窗可用；卡片数量与源码卡片集合一致。
3. 静态检查：预渲染 HTML 中无 button 套 button（用栈匹配数嵌套 `<button>` 开标签）。

### 推送后

`gh run list --repo SkyBiuBiu/imskyui` 确认 pages 工作流 success，再 `curl -s -o /dev/null -w "%{http_code}" https://skybiubiu.github.io/imskyui/` 验证线上返回 200 且含预渲染内容。

### 文档同步约定

演示站信息变更时同步维护：两份 README（`README.md` / `README.en.md`）顶部徽章区与导航行的在线演示入口、命令表中的 `build:pages`；GitHub 仓库 About 的 homepage 指向 Pages 地址，描述中的组件计数与 README 统计行保持一致（当前 66 个组件与场景 / 66 个组件与工具 / 18 种 HTTP 状态页面）。
