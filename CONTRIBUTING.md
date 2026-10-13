# 贡献指南

感谢关注 SkyUI。这是一套「复制源码即用」的黑白组件库，贡献前请先读一遍这份约定 —— 它们是这套设计语言能保持一致的原因。

## 开发环境

需要 Node.js 22+ 和 pnpm 9。

```bash
pnpm install        # 安装依赖
pnpm dev            # 启动展示站（http://localhost:3000）
pnpm typecheck      # TypeScript 类型检查
pnpm test           # vitest 单元测试
pnpm build          # 生产构建（产物在 dist/client）
```

## 硬性约定

1. **零组件依赖**。`ui.tsx` 里的组件只依赖 React，不引入图标库、浮层库或任何第三方包。图标一律用 CSS 或字符（`×` `+` `↗`）表达。
2. **黑白灰**。所有颜色通过 `ui.css` 的 `--skyui-*` 变量取值，不写死十六进制色值（`ui.css` 变量定义区除外）。新增组件必须自动跟随 `skyui-theme-dark`。
3. **无障碍不是可选项**。交互元素要有正确的 role 与 aria 属性；焦点可见；Escape / 遮罩可关闭浮层；对话框用原生 `dialog.showModal()`。
4. **中文文案**。组件内置文案（错误提示、aria-label、示例数据）使用中文。
5. **示例只在本地**。不引入真实提交、上传、持久化；展示数据均为示例并在界面注明。
6. **尊重 `prefers-reduced-motion`**。新增动画要在 reduced-motion 媒体查询里关闭。

## 改了组件，必须同步三处

- `src/components/ui.tsx` / `ui.css` —— 实现
- `docs/components.md` —— 组件 API 参考（props 签名与实现一一对应）
- `README.md` 与 `README.en.md` —— 组件数量、清单与接入说明

画廊卡片代码片段（`src/routes/index.tsx` 的 `snippets`）只是使用参考，不是完整实现，新增组件时记得补一条。

## 提交与版本

- 提交信息使用约定式前缀：`feat:` `fix:` `docs:` `style:` `refactor:` `test:` `chore:`。
- 版本号遵循 SemVer：新增组件 / props → minor；修复 → patch；破坏性改动 → major 并必须在 CHANGELOG 里写迁移说明。

### 版本号只有一个来源

`package.json` 的 `version` 与 `src/version.ts` 的 `VERSION` 必须一致，界面上的所有版本号文案
（侧边栏更新链接、页面徽章、更新日志弹窗）一律引用 `src/version.ts` 的常量，**不要在
`index.tsx` 里硬编码 `v1.x`**。

```bash
# 发版前校验：package.json / version.ts / CHANGELOG / README 四者是否同步
pnpm check:version
```

校验脚本会拦截：版本号不一致、CHANGELOG 缺条目、源码出现硬编码版本号、README 组件计数过期。
CI 也会跑这一项，改了组件忘记同步会直接失败。

> 例外：`snippets` 里的示例代码字符串、以及 409 场景的业务文案（讲的是资源版本冲突）不参与校验，
> 脚本里有显式豁免清单。

### 发版流程

版本号改完后，一条命令完成校验 → 打 tag → 创建 Release：

```bash
# 1. 改版本号（package.json 与 src/version.ts 两处）
# 2. CHANGELOG.md 顶部新增版本段落
# 3. 界面有变化时重新截图（需先 pnpm build 并启动 vite preview --port 4190）
pnpm capture

# 4. 提交并合入 main，然后：
pnpm release --dry-run    # 先看一遍将要执行的动作，不落地
pnpm release# 正式发版
```

`pnpm release` 做的事（`scripts/release.mjs`）：

| 步骤 | 内容 |
|---|---|
| 前置校验 | 必须在 main 分支、工作区干净、`gh` 已登录、CHANGELOG 有当前版本段落 |
| 全量校验 | 复用 `pnpm release:check`：版本一致性 + 类型 + 测试 + 构建 |
| 打 tag | annotated tag，message 取 CHANGELOG 段落前几行 |
| Release 正文 | **自动从 `CHANGELOG.md` 抽取当前版本段落**，不再人工复制粘贴 |

常用参数：

- `--dry-run`：只打印动作不落地。校验逻辑仍会真实执行（否则分支/状态判断会拿到空值误判）。
- `--draft`：创建草稿 Release，人工确认后再点Publish。

已存在的 tag 会自动跳过打 tag 步骤，因此 `--dry-run` 可以对已发过的版本安全重跑。

> Windows 上 `pnpm` 是 `.cmd` shim，Node 20+ 禁止不经 shell 直接 spawn，
> 所以脚本里只对 `pnpm` 置 `shell: true`；`git` / `gh` 是真实 exe，
> tag message 里的中文与换行走 shell 会被引号规则破坏，必须保持 argv 直传。

### README 示意图

`docs/images/` 下的截图由 `pnpm capture` 生成（Playwright，视口清单在 `scripts/capture.mjs`）。
组件有视觉变化时必须重跑，否则 README 会与实际界面脱节 —— v1.3.0 的截图里「数据概览」还是
CSS 柱状 div，看不到任何真实图表。

局部重跑：`SHOT_FILTER=11b,13-mobile pnpm capture`

## 提交 PR 之前

```bash
pnpm release:check
```

包含版本一致性校验、类型检查、单元测试与生产构建，全绿再提。CI 会跑同样的检查。
