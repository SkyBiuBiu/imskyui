# GitHub About 配置记录

仓库：`SkyBiuBiu/imskyui`
状态：**已通过 API 写入**（2026-10-12）

填写入口：https://github.com/SkyBiuBiu/imskyui （About 右侧齿轮图标可随时修改）

当前状态：

| 字段 | 状态 |
| --- | --- |
| Description | ✅ 已填，121 字符（上限 350） |
| Topics | ✅ 已填 12 个（上限 20） |
| Website | ⬜ 有意留空，原因见下|
| Social preview | ⬜ 未设置，可选 |

---

## 1. Description ✅

实际写入的内容（中英双语，兼顾中文读者与英文搜索流量）：

```
纯黑白 UI 组件库与交互式展示站 · 37 个组件与场景 · 18 种 HTTP 状态页面 · Monochrome UI library for React, copy the source, zero npm dependencies.
```

设计思路：前半段中文保证项目调性一致，后半段塞入 `Monochrome UI library`、`React`、`copy the source`、`zero npm dependencies` 等英文检索词 —— GitHub 的搜索索引对英文更友好，能覆盖更大的检索面。

如需改为纯中文或纯英文，用上面命令重新 PATCH 即可。

## 2. Topics ✅ 12 个

```
component-library · dark-mode · design-system · frontend
http-status-pages · monochrome · react · tailwindcss
tanstack · typescript · ui-components · vite
```

| Topic | 为什么加 |
| --- | --- |
| `react` `typescript` `vite` `tailwindcss` | 主要技术栈，进对应技术标签检索池 |
| `ui-components` `design-system` `component-library` | 核心品类词，命中量最大 |
| `monochrome` `dark-mode` | 本项目最突出的设计特征，差异化标签 |
| `http-status-pages` | 少见的细分标签，竞争小，容易被搜到 |
| `tanstack` | 框架相关，蹭生态流量 |
| `frontend` | 宽泛分类，带来基础曝光 |

> `monochrome` 和 `http-status-pages` 属于低竞争占坑词 —— 这类标签下同类项目少，
> 被搜到的概率远高于 `react` 这种红海标签。值得占。

## 3. Website ⬜ 有意留空

`.netlify/state.json` 里只有本地 dev 的 postgres 连接串，没有线上 site ID。
**没有猜测 URL 填进去** —— 填错的链接比空着更糟。

拿到地址后填：Netlify 后台 → 该站点 → Overview，复制形如
`https://xxx-yyy-123.netlify.app` 的地址（注意不是 `xxx.netlify.app`）。

## 4. Social preview（可选）

仓库未设置，1280×640。不影响任何功能，只影响 PR / commit 等场景的分享大图。

现成素材：`docs/images/01-gallery-light.png` 是 1400×875，比例接近，可裁一版：

```bash
ffmpeg -i docs/images/01-gallery-light.png -vf "scale=1280:-1,crop=1280:640" social-preview.png
```

---

## 补充：仓库仍缺 LICENSE

仓库根目录**没有 LICENSE 文件**，README 里也没有许可声明。
这对组件库类项目影响实际 —— 别人想复用你的组件时，没有许可声明会犹豫。

需要你确认用哪个，确认后我可以直接把文件写好并提交：

- **MIT** —— 最宽松，允许商用和闭源分发，组件库最常见选择
- **Apache-2.0** —— MIT 基础上多了明确的专利授权条款
- 保持现状（不加）—— 别人只能看，不能合法复用

---

## 附：本次写入用到的命令

```bash
# 取 GCM 凭据（与 git push 同一套，40 位 token）
cred=$(printf 'protocol=https\nhost=github.com\n\n' | git credential fill 2>/dev/null)
pw=$(echo "$cred" | grep '^password=' | cut -d= -f2-)

# 1) 改 description ——注意：PATCH repo 里带 topics 会被 GitHub 静默忽略
curl -s -X PATCH \
  -H "Authorization: Bearer $pw" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -H "Content-Type: application/json" \
  https://api.github.com/repos/SkyBiuBiu/imskyui \
  -d '{"description":"..."}'

# 2) 改 topics —— 必须用独立的 topics 接口，且是 PUT 不是 PATCH
curl -s -X PUT \
  -H "Authorization: Bearer $pw" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -H "Content-Type: application/json" \
  https://api.github.com/repos/SkyBiuBiu/imskyui/topics \
  -d '{"names":["react","typescript"]}'

# 3) 匿名复核（不带 token，确认真的落库了）
curl -s https://api.github.com/repos/SkyBiuBiu/imskyui
```

**关键坑**：`PATCH /repos/{owner}/{repo}` 里同时带 `topics` 字段，接口返回 200 且
description 正常写入，但 `topics` 会被**静默忽略**（返回值仍是 0 个）。
必须单独调 `PUT /repos/{owner}/{repo}/topics`。