# GitHub About 配置清单

仓库：`SkyBiuBiu/imskyui`
填写入口：https://github.com/SkyBiuBiu/imskyui （页面右侧 **About** → 右侧齿轮图标）

当前状态：Description 空 · Website 空 · Topics 空 · 可见性 Public

---

## 1. Description（上限 350 字符，建议 120 以内）

填入这一行：

```
纯黑白 UI 组件库与交互式展示站 · 37 个组件与场景 · 18 种 HTTP 状态页面 · React 19 + TypeScript · 下载源码即用，零组件依赖
```

英文版（如果想让更多人搜到）：

```
Monochrome UI component library & showcase — 37 components, 18 HTTP status pages. Copy the source, zero npm dependencies.
```

> GitHub 的搜索索引对英文关键词更友好，Description 只影响仓库列表和搜索结果权重，不影响页面内容。README 主体已是中文，Description 用英文覆盖面更广，中文版本留给你自己选。

---

## 2. Topics（上限 20 个，建议 8-12 个）

逐个点 **Add topic** 添加：

```
react
typescript
ui-components
design-system
component-library
tanstack
vite
tailwindcss
monochrome
dark-mode
http-status-pages
frontend
```

说明：

| Topic | 为什么加 |
| --- | --- |
| `react` `typescript` `vite` `tailwindcss` | 主要技术栈，进对应技术标签的检索池 |
| `ui-components` `design-system` `component-library` | 核心品类词，命中最多 |
| `monochrome` `dark-mode` | 本项目最突出的设计特征，差异化标签 |
| `http-status-pages` | 少见的细分标签，竞争小，容易被搜到 |
| `tanstack` | 框架相关，蹭生态流量 |

> Topics 会显示在仓库页右侧，并参与 GitHub 主题聚合页。`monochrome` 和 `http-status-pages` 这类词竞争小，是拿曝光的好入口，值得占坑。

---

## 3. Website（可留空）

我不知道线上部署地址 —— `.netlify/state.json` 里只有本地 dev 的数据库连接串，没有线上 site ID，所以这里**不填**，也不给你一个猜出来的 URL。

拿到地址后填：Netlify 后台 → 该站点 → Overview，复制形如 `https://xxx-yyy-123.netlify.app` 的地址。

留空也不影响，Website 只是展示用的外链。

---

## 可选：Social preview 图

仓库未设置。About 右侧的社交预览图会显示在 PR、commit 等场景，1280×640。

目前已有现成素材：`docs/images/01-gallery-light.png` 是 1400×875，比例接近，可以用它生成：

```bash
# 需要 ImageMagick 或 ffmpeg 任一
ffmpeg -i docs/images/01-gallery-light.png -vf "scale=1280:-1,crop=1280:640" social-preview.png
```

不上传预览图不影响任何功能，只是分享出去时没有大图。

---

## 补充：仓库还缺一个 LICENSE

仓库根目录**没有 LICENSE 文件**，README 里也没有许可声明。这不影响 About 展示，但如果别人想复用这套组件，没有许可声明会让人犹豫。

如果要加，需要你先选一个：

- **MIT** —— 最宽松，允许商用和闭源分发
- **Apache-2.0** —— MIT 基础上多了明确的专利授权条款
- 声明保留所有权利（不加 LICENSE 文件）—— 别人只能看，不能合法复用

组件库这类项目通常选 MIT。确认后我可以直接把 LICENSE 文件写好并提交。