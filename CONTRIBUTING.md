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
- 发版流程：更新 `package.json` `version` → 在 `CHANGELOG.md` 顶部新增版本段落 → 合入 main → 打 annotated tag（`git tag -a vX.Y.Z -m "..."`）→ GitHub Release 引用 CHANGELOG 对应段落。

## 提交 PR 之前

```bash
pnpm typecheck && pnpm test && pnpm build
```

三件事全绿再提。CI 会跑同样的检查。
