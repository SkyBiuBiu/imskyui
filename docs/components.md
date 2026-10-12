# SkyUI 组件 API 参考

> 本文与 `src/components/ui.tsx`、`src/components/scenarios.tsx` 的实现一一对应。
> 所有基础组件**只依赖 React**（需要 React 18+，内部使用了 `useId`），不需要图标库或其他第三方包。

## 通用说明

- **主题切换**：在外层容器加 `skyui-theme-dark` class，全部组件自动跟随深色主题。
- **样式定制**：修改 `ui.css` 中的 `--skyui-*` CSS 变量（色彩 / 圆角 / 间距）。
- **类名合并**：接受 `className` 的组件会把你的类名追加到内置类名之后。
- **无障碍**：表单组件自动生成 `id` 并关联 `label` / `aria-describedby`；`Alert` 按 variant 输出 `role="alert"` 或 `role="status"`。

---

## 基础组件（ui.tsx，12 个）

### Button

原生 `button` 的封装。扩展 `ButtonHTMLAttributes<HTMLButtonElement>`，其余原生属性全部透传。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | 主要 / 次要 / 文字按钮 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 默认已设为 `button`，防止表单误提交；提交按钮请显式传 `type="submit"` |

```tsx
<Button variant="secondary" onClick={close}>取消</Button>
```

### Input

自带 label 与错误/帮助文案的输入框。扩展 `InputHTMLAttributes<HTMLInputElement>`。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 可选，渲染在输入框上方的 `<label>` |
| `invalid` | `boolean` | — | 错误态：红色边框 + `aria-invalid` |
| `error` | `string` | — | `invalid` 为真时展示的错误文案（缺省为「请输入有效的内容。」） |
| `helpText` | `string` | — | 非错误状态下的帮助文案（与 `error` 互斥，错误优先） |

自动处理：`id` 缺省时用 `useId` 生成并与 label 关联；`aria-describedby` 指向提示文案。

```tsx
<Input label="邮箱" type="email" value={email} onChange={e => setEmail(e.target.value)}
       invalid={!isEmail(email)} error="请填写有效的邮箱地址。" required />
```

### Switch

开关。受控组件，渲染为 `role="switch"` 的 button。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `checked` | `boolean` | — | 受控状态 |
| `onChange` | `(checked: boolean) => void` | — | 点击后回调新状态（取反后的值） |
| `label` | `string` | — | 必填，作为 `aria-label` |
| `disabled` | `boolean` | `false` | 禁用态 |

### Badge

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `'light' \| 'dark' \| 'outline'` | `'light'` | 浅底 / 深底 / 描边 |

### Avatar

取 `name` 的第一个字符作为头像内容。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | — | 必填，同时作为 `aria-label` |
| `size` | `'normal' \| 'large'` | `'normal'` | 尺寸 |
| `tone` | `'dark' \| 'light'` | `'dark'` | 深底浅字 / 浅底深字 |

### Checkbox

自带 label 的复选框。扩展 `InputHTMLAttributes<HTMLInputElement>`（去掉 `type`，内部固定为 checkbox）。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 必填，渲染在复选框右侧 |

```tsx
<Checkbox label="同意条款" checked={ok} onChange={e => setOk(e.target.checked)} />
```

### Select

自带 label 的下拉框。扩展 `SelectHTMLAttributes<HTMLSelectElement>`，`<option>` 通过 `children` 传入。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 必填，渲染在上方并与 select 关联 |

```tsx
<Select label="通知频率" value={freq} onChange={e => setFreq(e.target.value)}>
  <option>每周摘要</option>
  <option>每日摘要</option>
</Select>
```

### Textarea

自带 label 与错误文案的多行输入。扩展 `TextareaHTMLAttributes<HTMLTextAreaElement>`。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 必填 |
| `error` | `string` | — | 有值时进入错误态并展示错误文案 |

### Alert

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 必填，加粗标题 |
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | 左侧符号分别为 `i` / `✓` / `!` / `×`；`error` 时 `role="alert"`，其余 `role="status"` |
| `children` | `ReactNode` | — | 可选，标题下的描述内容 |

### Skeleton

骨架屏占位。渲染为 `aria-hidden` 的 span，闪烁动画由 CSS 提供。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `className` | `string` | `''` | 可叠加自定义尺寸类 |
| `style` | `CSSProperties` | — | 常用 `style={{ width: '72%' }}` 控制宽度 |

### EmptyState

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 必填，`<h4>` 标题 |
| `description` | `string` | — | 必填，说明文字 |
| `action` | `ReactNode` | — | 可选，通常是操作按钮 |

### HttpStatusPage

HTTP 状态页面。视觉与文案按 `code` 的百位分类（`2xx` / `3xx` / `4xx` / `5xx`）自动切换。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `code` | `number` | — | 必填，如 `404`。只影响界面，不发送请求 |
| `title` | `string` | — | 必填，大标题 |
| `description` | `string` | — | 必填，说明文字 |
| `actions` | `ReactNode` | — | 可选，操作区，通常是导航 / 重试按钮 |

```tsx
<HttpStatusPage
  code={404}
  title="这一页，留白了"
  description="我们没有找到这个页面。"
  actions={<Button onClick={() => router.navigate({ to: '/' })}>返回首页</Button>}
/>
```

---

## 完整场景（scenarios.tsx，可选下载）

`scenarios.tsx` 依赖同目录的 `ui.tsx`，提供 8 个导出。这些都是**可直接渲染的演示场景**：数据是示例、表单只做本地校验、不发网络请求，接入自己的项目时替换其中的假数据与提交逻辑即可。

### httpScenarios

`readonly` 数组，18 个 HTTP 场景（200 / 201 / 202 / 204 / 301 / 400 / 401 / 403 / 404 / 408 / 409 / 410 / 422 / 429 / 500 / 502 / 503 / 504），每项结构：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `code` | `number` | HTTP 状态码 |
| `name` | `string` | 标准短语，如 `'Not Found'` |
| `title` | `string` | 页面大标题（中文文案） |
| `description` | `string` | 页面说明 |
| `action` | `string` | 主操作按钮文案 |
| `result` | `string` | 点击操作后的结果提示文案 |

### HttpDemo

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `scenario` | `(typeof httpScenarios)[number]` | 传入 `httpScenarios` 的一项。`code === 429` 时按钮带 5 秒倒计时 |

其余场景组件均为**无 props** 的自包含演示：`<ContactFormDemo />` 等。

| 组件 | 演示内容 |
| --- | --- |
| `ContactFormDemo` | 联系表单：姓名 / 邮箱格式 / 留言长度的本地校验，错误自动聚焦 |
| `MultiStepFormDemo` | 三步分步表单：基本信息 → 确认 → 完成，返回时保留输入 |
| `SettingsFormDemo` | 偏好设置：Switch 联动 Select、单选组、重置 |
| `UploadFieldDemo` | 文件选择与拖放：校验类型（PNG/JPG/PDF）与 5 MB 上限，只读元数据不上传 |
| `DataStatesDemo` | 骨架屏 / 空状态 / 失败重试 / 成功 四态手动切换 |
| `DataTableDemo` | 数据表格：关键词筛选、日期排序、分页（全部示例数据） |
| `NavigationDemo` | 面包屑 + 分页的导航交互示例 |

```tsx
import { ContactFormDemo, DataTableDemo, httpScenarios, HttpDemo } from './components/scenarios'

<ContactFormDemo />
{httpScenarios.map(s => <HttpDemo key={s.code} scenario={s} />)}
```
