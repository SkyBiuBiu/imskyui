# SkyUI 组件 API 参考

> 本文与 `src/components/ui.tsx`、`src/components/scenarios.tsx` 的实现一一对应。
> 所有基础组件**只依赖 React**（需要 React 18+，内部使用了 `useId`），不需要图标库或其他第三方包。

## 通用说明

- **主题切换**：在外层容器加 `skyui-theme-dark` class，全部组件自动跟随深色主题。
- **样式定制**：修改 `ui.css` 中的 `--skyui-*` CSS 变量（色彩 / 圆角 / 间距）。
- **类名合并**：接受 `className` 的组件会把你的类名追加到内置类名之后。
- **无障碍**：表单组件自动生成 `id` 并关联 `label` / `aria-describedby`；`Alert` 按 variant 输出 `role="alert"` 或 `role="status"`；浮层组件支持 Escape 关闭。

---

## 基础组件（ui.tsx，12 个 · v1.1.0）

> 自 v1.2.0 起全部组件同在 `ui.tsx`，本节的「12 个」指最初的首批基础组件。

### Button

原生 `button` 的封装。扩展 `ButtonHTMLAttributes<HTMLButtonElement>`，其余原生属性全部透传。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | 主要 / 次要 / 文字按钮 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸（v1.2.0 新增） |
| `loading` | `boolean` | `false` | 加载态：内置 spinner、`aria-busy`、自动禁用（v1.2.0 新增） |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 默认已设为 `button`，防止表单误提交；提交按钮请显式传 `type="submit"` |

```tsx
<Button variant="secondary" size="lg" loading={submitting} onClick={submit}>提交中…</Button>
```

### Input

自带 label 与错误/帮助文案的输入框。扩展 `InputHTMLAttributes<HTMLInputElement>`。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 可选，渲染在输入框上方的 `<label>` |
| `invalid` | `boolean` | — | 错误态：虚线边框 + `aria-invalid` |
| `error` | `string` | — | `invalid` 为真时展示的错误文案（缺省为「请输入有效的内容。」） |
| `helpText` | `string` | — | 非错误状态下的帮助文案（与 `error` 互斥，错误优先） |
| `prefix` | `ReactNode` | — | 前缀插槽，与输入框组合为带边框输入组（v1.2.0 新增） |
| `suffix` | `ReactNode` | — | 后缀插槽（v1.2.0 新增） |

自动处理：`id` 缺省时用 `useId` 生成并与 label 关联；`aria-describedby` 指向提示文案。

```tsx
<Input label="预算" placeholder="0.00" prefix="¥" suffix="CNY" />
<Input label="邮箱" type="email" invalid={!isEmail(email)} error="请填写有效的邮箱地址。" required />
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

取 `name` 的第一个字符作为头像内容；传入 `src` 时优先显示图片，加载失败自动回退首字符。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | — | 必填，同时作为 `aria-label` |
| `src` | `string` | — | 可选，图片地址；加载失败回退首字符（v1.2.0 新增） |
| `size` | `'normal' \| 'large'` | `'normal'` | 尺寸 |
| `tone` | `'dark' \| 'light'` | `'dark'` | 深底浅字 / 浅底深字 |
| `status` | `'online' \| 'busy' \| 'offline'` | — | 可选状态点（v1.2.0 新增） |

### Checkbox

自带 label 的复选框。扩展 `InputHTMLAttributes<HTMLInputElement>`（去掉 `type`，内部固定为 checkbox）。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 必填，渲染在复选框右侧 |
| `indeterminate` | `boolean` | — | 半选态（v1.2.0 新增） |

```tsx
<Checkbox label="全选" indeterminate={some && !all} checked={all} onChange={e => setAll(e.target.checked)} />
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
| `dismissible` | `boolean` | `false` | 显示关闭按钮，点击后组件隐藏（v1.2.0 新增） |
| `onClose` | `() => void` | — | 关闭时回调（v1.2.0 新增） |

### Skeleton

骨架屏占位。渲染为 `aria-hidden` 的 span，闪烁动画由 CSS 提供。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `'text' \| 'circle' \| 'rect'` | `'text'` | 形状变体（v1.2.0 新增） |
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

## 浮层组件（ui.tsx，v1.2.0 新增）

### Tooltip

纯 CSS 提示，悬停或键盘聚焦时显示。无额外 DOM，无依赖。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string` | — | 必填，提示文案 |
| `side` | `'top' \| 'bottom'` | `'top'` | 弹出方向 |
| `children` | `ReactNode` | — | 触发元素，需可聚焦 |

```tsx
<Tooltip content="保存并发布"><Button size="sm">发布</Button></Tooltip>
```

### Dropdown

下拉菜单。点击外部或 Escape 关闭；`role="menu"` / `role="menuitem"`。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `trigger` | `ReactNode` | — | 必填，触发按钮内容（组件自己渲染 `<button>`） |
| `items` | `{ label: string; onSelect?: () => void; disabled?: boolean }[]` | — | 必填，菜单项 |
| `ariaLabel` | `string` | — | 必填，菜单的 `aria-label` |
| `align` | `'start' \| 'end'` | `'start'` | 菜单对齐方向 |

### Modal

基于原生 `dialog.showModal()` 的对话框：自带焦点限制、Escape 关闭（`onCancel`）、遮罩点击关闭与关闭后焦点还原。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean` | — | 必填，受控开关 |
| `onClose` | `() => void` | — | 必填，请求关闭时回调 |
| `title` | `ReactNode` | — | 可选，标题（含右上角关闭按钮） |
| `children` | `ReactNode` | — | 内容 |
| `footer` | `ReactNode` | — | 可选，底部操作区（右对齐） |

### Drawer

抽屉面板。Escape、遮罩点击、右上角按钮均可关闭。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean` | — | 必填，受控开关 |
| `onClose` | `() => void` | — | 必填 |
| `title` | `ReactNode` | — | 可选 |
| `side` | `'left' \| 'right' \| 'bottom'` | `'right'` | 弹出方向 |
| `children` | `ReactNode` | — | 内容 |
| `footer` | `ReactNode` | — | 可选 |

### ToastProvider / useToast

命令式 Toast。`ToastProvider` 渲染右下角通知容器；`useToast()` 返回推送函数。

| Prop / 返回 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ToastProvider.duration` | `number` | `3200` | 默认自动消失毫秒数 |
| `toast(message, options?)` | `(message: string, options?: { variant?: 'info' \| 'success' \| 'error'; duration?: number }) => void` | — | 推送一条通知；在 `<ToastProvider>` 外调用会抛错 |

```tsx
<ToastProvider>
  <App />
</ToastProvider>

// 任意子组件内
const toast = useToast()
toast('一切就绪。', { variant: 'success' })
```

---

## 导航组件（ui.tsx，v1.2.0 新增）

### Tabs

受控 / 非受控标签页。完整 `role="tablist"` / `tab` / `tabpanel` 结构。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `{ id: string; label: ReactNode; content: ReactNode }[]` | — | 必填 |
| `value` / `defaultValue` | `string` | 首项 id | 受控 / 非受控激活项 |
| `onChange` | `(id: string) => void` | — | 切换回调 |
| `ariaLabel` | `string` | — | tablist 的 `aria-label` |

### Accordion

折叠面板。默认单开互斥，`multiple` 开启多开。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `{ title: ReactNode; content: ReactNode }[]` | — | 必填 |
| `defaultOpen` | `number[]` | `[]` | 初始展开项下标 |
| `multiple` | `boolean` | `false` | 是否允许多开 |
| `ariaLabel` | `string` | — | 容器 `aria-label` |

### Breadcrumb

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `{ label: ReactNode; onClick?: () => void; href?: string }[]` | — | 必填；最后一项自动 `aria-current="page"`；带 `href` 渲染 `<a>`，否则渲染 `<button>` |
| `ariaLabel` | `string` | `'面包屑'` | 导航 `aria-label` |

### Pagination

窗口化页码分页（最多显示 5 个页码，自动居中当前页）。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `page` | `number` | — | 必填，当前页 |
| `pageCount` | `number` | — | 必填，总页数 |
| `onChange` | `(page: number) => void` | — | 必填 |
| `ariaLabel` | `string` | `'分页'` | 分组 `aria-label` |

### Steps

步骤条。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `string[]` | — | 必填，步骤名 |
| `current` | `number` | — | 必填，当前步骤（1 起始；之前的步骤全部高亮） |
| `ariaLabel` | `string` | `'步骤'` | `aria-label` |

---

## 数据与布局组件（ui.tsx，v1.2.0 新增）

### Progress / Slider

| 组件 | Props | 说明 |
| --- | --- | --- |
| `Progress` | `value: number; max?: number; label?: string` | `role="progressbar"`，带 `aria-valuenow` |
| `Slider` | `value: number; onChange: (v: number) => void; min?: number; max?: number; label?: string` | 原生 range，`accent-color` 取主题色 |

### AvatarGroup / Tag

| 组件 | Props | 说明 |
| --- | --- | --- |
| `AvatarGroup` | `people: { name: string; src?: string }[]; max?: number(3); size?` | 叠放头像；超出部分渲染 `+N` 并带 `aria-label` |
| `Tag` | `children: ReactNode; onRemove?: () => void` | 可移除标签；传 `onRemove` 才显示关闭按钮 |

### Table

泛型表格，columns 配置式 API。v1.3.0 起内置加载态、粘性表头与行展开。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columns` | `{ key: string; header: ReactNode; render?: (row: T) => ReactNode; width?: number \| string }[]` | — | 必填；未传 `render` 时按 `row[key]` 输出字符串 |
| `rows` | `T[]` | — | 必填 |
| `caption` | `string` | — | 可选，`<caption>` |
| `rowKey` | `(row: T, index: number) => React.Key` | 下标 | 行 key |
| `empty` | `ReactNode` | — | 空数据占位（`colSpan` 全行） |
| `loading` | `boolean` | `false` | 渲染 3 行骨架屏，不渲染数据行 |
| `sticky` | `boolean` | `false` | 表头 `position: sticky`，长表格滚动时固定 |
| `expandable` | `{ expandedRowRender: (row: T) => ReactNode; rowExpandable?: (row: T) => boolean }` | — | 行展开：首列渲染展开按钮，展开内容渲染为整行 |

```tsx
<Table
  caption="素材清单"
  rowKey={row => row.id}
  rows={rows}
  loading={loading}
  sticky
  expandable={{ expandedRowRender: row => <p>{row.detail}</p> }}
  columns={[
    { key: 'name', header: '素材', render: row => <strong>{row.name}</strong> },
    { key: 'state', header: '状态', render: row => <Badge variant="outline">{row.state}</Badge> },
  ]}
/>
```

### Statistic / Timeline / Descriptions

| 组件 | Props | 说明 |
| --- | --- | --- |
| `Statistic` | `label: string; value: ReactNode; delta?: string; trend?: 'up' \| 'down'` | 统计数值，衬线大字，`delta` 渲染为 ↗/↘ 徽标 |
| `Timeline` | `items: { title: ReactNode; description?: ReactNode; time?: string }[]` | 时间线，左侧圆点轴线 |
| `Descriptions` | `items: { label: string; value: ReactNode }[]` | 描述列表，自动换行的卡片网格 |

### Divider / Stack / Container

| 组件 | Props | 说明 |
| --- | --- | --- |
| `Divider` | `label?: string; vertical?: boolean` | 分隔线；`label` 居中文案；`vertical` 竖向 |
| `Stack` | `direction?: 'row' \| 'column'; gap?: number(12); align?; justify?; wrap?` | flex 布局原语 |
| `Container` | `maxWidth?: number(960)` | 居中容器 |

---

## v1.3.0 新增组件（ui.tsx，24 个导出）

### 排版与容器

| 组件 | Props | 说明 |
| --- | --- | --- |
| `Title` | `level?: 1\|2\|3\|4(2); children; className?` | 渲染对应 `h1`~`h4`，统一黑白标题层级 |
| `Text` | `type?: 'default'\|'secondary'\|'muted'; strong?; underline?; strikethrough?; code?; mark?; children` | 行内文本；`code` 渲染 `<code>`，`mark` 渲染 `<mark>` |
| `Paragraph` | `children; className?` | 正文段落（12px / 行高 1.8） |
| `Kbd` | `children; className?` | 键盘按键，如 `<Kbd>⌘K</Kbd>` |
| `Card` | `title?; extra?; footer?; hoverable?; padded?(true); children; className?` | 卡片容器，含标题栏 / 内容区 / 页脚三段结构 |
| `Label` | `children; htmlFor?; required?; className?` | 表单标签，`required` 追加必填星号 |

### 选择控件

| 组件 | Props | 说明 |
| --- | --- | --- |
| `Segmented` | `options: (string \| { value; label; disabled? })[]; value; onChange; size?: 'sm'\|'md'` | 分段控件，`role="radiogroup"`，选项可为字符串或对象 |
| `RadioGroup` | `options; value; onChange; name?; direction?: 'row'\|'column'` | 单选组，自动生成共享 `name` |
| `Toggle` | `pressed; onChange; children; ariaLabel?` | 双态按钮，输出 `aria-pressed` |
| `ToggleGroup` | `options; value: string[]; onChange; multiple?` | 切换按钮组；`multiple=false` 时单选互斥 |
| `Rate` | `count?(5); value; onChange?; allowClear?(true)` | 星级评分，`role="radio"`，重复点击同一颗星清零 |

### 浮层扩展与加载

| 组件 | Props | 说明 |
| --- | --- | --- |
| `Popover` | `trigger; content; align?: 'start'\|'end'; open?; onOpenChange?` | 点击式气泡卡片，承载交互内容；支持受控 / 非受控 |
| `HoverCard` | `content; children` | 悬停 / 键盘聚焦显示的卡片，纯 CSS 驱动 |
| `Spin` | `size?: 'sm'\|'md'\|'lg'; label?('加载中')` | 独立加载指示器，`role="status"` |

### 表单抽象

| 组件 | Props | 说明 |
| --- | --- | --- |
| `useForm` | `{ initialValues; rules?: { [K in keyof T]?: { required?; pattern?; min?; max?; message? } }; onSubmit? }` | 返回 `{ values, errors, setField, handleSubmit }`；提交时全量校验，通过后回调 |
| `FormItem` | `label; error?; htmlFor?; required?; children` | 表单项包装，`error` 存在时输出 `role="alert"` 提示 |

```tsx
const { values, errors, setField, handleSubmit } = useForm({
  initialValues: { email: '' },
  rules: { email: { required: true, pattern: /@/, message: '需要有效邮箱。' } },
  onSubmit: values => submit(values),
})
<form onSubmit={handleSubmit}>
  <FormItem label="邮箱" error={errors.email} htmlFor="email">
    <Input id="email" value={values.email} onChange={event => setField('email', event.target.value)} />
  </FormItem>
  <Button type="submit">提交</Button>
</form>
```

### 命令面板

| 组件 | Props | 说明 |
| --- | --- | --- |
| `Command` | `open; onClose; items: { id; label; group?; onSelect? }[]; placeholder?; emptyText?` | 基于 `Modal` 的命令面板：输入过滤、↑↓ 导航、Enter 选择、Esc 关闭 |

### 日期

| 组件 | Props | 说明 |
| --- | --- | --- |
| `Calendar` | `value?: Date \| null; onChange?; minDate?; maxDate?` | 月历网格（周一起始），←→↑↓ 移动、PageUp/PageDown 换月、Enter 选择；`minDate`/`maxDate` 置灰禁用 |
| `DatePicker` | `value?; onChange?; placeholder?('选择日期'); label?; minDate?; maxDate?` | 输入框 + `Popover` + `Calendar`，选择后自动收起 |

### 展示与布局

| 组件 | Props | 说明 |
| --- | --- | --- |
| `Carousel` | `items: ReactNode[]; autoPlay?; interval?(4000)` | 轮播：左右箭头 + 指示点，非当前页 `aria-hidden` |
| `Grid` | `cols?(12); gap?(12)` | CSS Grid 容器，通过 context 传递列数 |
| `GridItem` | `span?(12)` | 栅格列，`span` 自动按父级 `cols` 裁剪 |
| `ConfigProvider` | `theme?: 'light'\|'dark'; size?: 'sm'\|'md'\|'lg'` | 注入主题类与默认尺寸（当前 `Button` 消费 `size`，`theme` 输出 `skyui-theme-*` 类） |
| `useSkyUIConfig` | — | 读取 `ConfigProvider` 注入的配置 |

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

其余场景组件均为**可直接渲染的演示**：`<ContactFormDemo />` 等。

| 组件 | 演示内容 |
| --- | --- |
| `ContactFormDemo` | 联系表单：姓名 / 邮箱格式 / 留言长度的本地校验，错误自动聚焦 |
| `MultiStepFormDemo` | 三步分步表单（基于 `Steps` 组件）：基本信息 → 确认 → 完成，返回时保留输入 |
| `SettingsFormDemo` | 偏好设置：Switch 联动 Select、单选组、重置 |
| `UploadFieldDemo` | 文件选择与拖放：校验类型（PNG/JPG/PDF）与 5 MB 上限，只读元数据不上传 |
| `DataStatesDemo` | 骨架屏 / 空状态 / 失败重试 / 成功 四态手动切换 |
| `DataTableDemo` | 数据表格（基于 `Table` + `Pagination`）：关键词筛选、日期排序、分页 |
| `NavigationDemo` | 面包屑 + 分页（基于 `Breadcrumb` / `Pagination` 组件） |

```tsx
import { ContactFormDemo, DataTableDemo, httpScenarios, HttpDemo } from './components/scenarios'

<ContactFormDemo />
{httpScenarios.map(s => <HttpDemo key={s.code} scenario={s} />)}
```
