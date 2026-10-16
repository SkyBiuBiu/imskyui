import { cloneElement, createContext, Fragment, isValidElement, useCallback, useContext, useEffect, useId, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, FormEvent, HTMLAttributes, InputHTMLAttributes, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactElement, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import './ui.css'

const ConfigContext = createContext<{ theme?: 'light' | 'dark'; size?: 'sm' | 'md' | 'lg' }>({})
const GridContext = createContext(12)

/* ------------------------------------------------------------------ */
/* 基础控件                                                            */
/* ------------------------------------------------------------------ */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' | 'lg'; loading?: boolean }
export function Button({ variant = 'primary', size, loading = false, className = '', type = 'button', disabled, children, ...props }: ButtonProps) {
  const config = useContext(ConfigContext)
  const resolvedSize = size ?? config.size ?? 'md'
  const sizeClass = resolvedSize === 'md' ? '' : ` skyui-button-${resolvedSize}`
  return <button type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={`skyui-button skyui-button-${variant}${sizeClass} ${loading ? 'skyui-button-loading' : ''} ${className}`} {...props}>{loading && <span className="skyui-spinner" aria-hidden="true" />}{children}</button>
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; invalid?: boolean; error?: string; helpText?: string; prefix?: ReactNode; suffix?: ReactNode }

export function Input({ label, invalid, error, helpText, prefix, suffix, className = '', id, 'aria-describedby': describedBy, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id || generatedId
  const message = invalid ? error || '请输入有效的内容。' : helpText
  const messageId = `${inputId}-message`
  const hasAffix = prefix !== undefined || suffix !== undefined
  const input = <input {...props} id={inputId} className={`skyui-input ${invalid ? 'skyui-input-invalid' : ''} ${hasAffix ? 'skyui-input-bare' : ''} ${className}`} aria-invalid={invalid || undefined} aria-describedby={[describedBy, message ? messageId : ''].filter(Boolean).join(' ') || undefined} />
  const field = hasAffix
    ? <span className={`skyui-input-group ${invalid ? 'skyui-input-group-invalid' : ''}`}>{prefix !== undefined && <span className="skyui-input-affix" aria-hidden="true">{prefix}</span>}{input}{suffix !== undefined && <span className="skyui-input-affix" aria-hidden="true">{suffix}</span>}</span>
    : input
  return <div className="skyui-input-label">{label && <label htmlFor={inputId}>{label}</label>}{field}{message && <small id={messageId}>{message}</small>}</div>
}

export function Switch({ checked, onChange, label, disabled = false }: { checked: boolean; onChange: (checked: boolean) => void; label: string; disabled?: boolean }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} className={`skyui-switch ${checked ? 'skyui-switch-on' : ''}`} onClick={() => onChange(!checked)}><span /></button>
}

export function Badge({ children, variant = 'light' }: { children: ReactNode; variant?: 'light' | 'dark' | 'outline' }) {
  return <span className={`skyui-badge skyui-badge-${variant}`}>{children}</span>
}

type AvatarProps = { name: string; src?: string; size?: 'normal' | 'large'; tone?: 'dark' | 'light'; status?: 'online' | 'busy' | 'offline' }

export function Avatar({ name, src, size = 'normal', tone = 'dark', status }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const showImage = src !== undefined && !failed
  return <span className={`skyui-avatar skyui-avatar-${size} skyui-avatar-${tone}`} aria-label={name}>
    {showImage ? <img src={src} alt="" onError={() => setFailed(true)} /> : name.slice(0, 1)}
    {status && <span className={`skyui-avatar-status skyui-avatar-status-${status}`} aria-label={status === 'online' ? '在线' : status === 'busy' ? '忙碌' : '离线'} />}
  </span>
}

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: string; indeterminate?: boolean }

export function Checkbox({ label, indeterminate, className = '', ...props }: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (inputRef.current) inputRef.current.indeterminate = Boolean(indeterminate) }, [indeterminate])
  return <label className={`skyui-checkbox ${className}`}><input ref={inputRef} {...props} type="checkbox" /><span>{label}</span></label>
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string }

export function Select({ label, id, className = '', children, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id || generatedId
  return <div className="skyui-input-label"><label htmlFor={selectId}>{label}</label><select {...props} id={selectId} className={`skyui-input skyui-select ${className}`}>{children}</select></div>
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }

export function Textarea({ label, error, id, className = '', 'aria-describedby': describedBy, ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id || generatedId
  return <div className="skyui-input-label"><label htmlFor={textareaId}>{label}</label><textarea {...props} id={textareaId} className={`skyui-input skyui-textarea ${error ? 'skyui-input-invalid' : ''} ${className}`} aria-invalid={Boolean(error) || undefined} aria-describedby={[describedBy, error ? `${textareaId}-error` : ''].filter(Boolean).join(' ') || undefined} />{error && <small id={`${textareaId}-error`}>{error}</small>}</div>
}

export function Alert({ title, children, variant = 'info', dismissible = false, onClose }: { title: string; children?: ReactNode; variant?: 'info' | 'success' | 'warning' | 'error'; dismissible?: boolean; onClose?: () => void }) {
  const [closed, setClosed] = useState(false)
  if (closed) return null
  const symbols = { info: 'i', success: '✓', warning: '!', error: '×' }
  function dismiss() { setClosed(true); onClose?.() }
  return <div className={`skyui-alert skyui-alert-${variant}`} role={variant === 'error' ? 'alert' : 'status'}><span className="skyui-alert-symbol" aria-hidden="true">{symbols[variant]}</span><div><strong>{title}</strong>{children && <div className="skyui-alert-description">{children}</div>}</div>{dismissible && <button type="button" className="skyui-icon-close skyui-alert-close" aria-label="关闭通知" onClick={dismiss}>×</button>}</div>
}

export function Skeleton({ variant = 'text', className = '', ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: 'text' | 'circle' | 'rect' }) {
  return <span {...props} aria-hidden="true" className={`skyui-skeleton ${variant === 'text' ? '' : `skyui-skeleton-${variant}`} ${className}`} />
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="skyui-empty-state"><span className="skyui-empty-symbol" aria-hidden="true"><span /></span><h4>{title}</h4><p>{description}</p>{action}</div>
}

export function HttpStatusPage({ code, title, description, actions }: { code: number; title: string; description: string; actions?: ReactNode }) {
  return <section className={`skyui-http-page skyui-http-${Math.floor(code / 100)}xx`} aria-label={`${code} ${title}`}><span className="skyui-http-label">skyui / HTTP {Math.floor(code / 100)}xx</span><div className="skyui-http-art" aria-hidden="true"><span /><span /><span /></div><strong className="skyui-http-code">{code}</strong><h4>{title}</h4><p>{description}</p>{actions && <div className="skyui-http-actions">{actions}</div>}</section>
}

/* ------------------------------------------------------------------ */
/* 浮层（Tooltip / Dropdown / Modal / Drawer / Toast）                  */
/* ------------------------------------------------------------------ */

export function Tooltip({ content, side = 'top', children, className = '' }: { content: string; side?: 'top' | 'bottom'; children: ReactNode; className?: string }) {
  return <span className={`skyui-tooltip skyui-tooltip-${side} ${className}`} data-tip={content}>{children}</span>
}

type DropdownItem = { label: string; onSelect?: () => void; disabled?: boolean }

export function Dropdown({ trigger, items, ariaLabel, align = 'start', className = '' }: { trigger: ReactNode; items: DropdownItem[]; ariaLabel: string; align?: 'start' | 'end'; className?: string }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) { if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false) }
    function onKeyDown(event: KeyboardEvent) { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown) }
  }, [open])
  return <div ref={rootRef} className={`skyui-dropdown ${className}`}>
    <button type="button" aria-haspopup="menu" aria-expanded={open} className="skyui-dropdown-trigger" onClick={() => setOpen(value => !value)}>{trigger}</button>
    {open && <div className={`skyui-menu skyui-menu-${align}`} role="menu" aria-label={ariaLabel}>
      {items.map(item => <button key={item.label} type="button" role="menuitem" disabled={item.disabled} onClick={() => { item.onSelect?.(); setOpen(false) }}>{item.label}</button>)}
    </div>}
  </div>
}

export function Modal({ open, onClose, title, children, footer, className = '' }: { open: boolean; onClose: () => void; title?: ReactNode; children?: ReactNode; footer?: ReactNode; className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) { previousFocus.current = document.activeElement as HTMLElement; dialog.showModal() }
    if (!open && dialog.open) { dialog.close(); previousFocus.current?.focus?.() }
  }, [open])
  return <dialog ref={dialogRef} className={`skyui-modal ${className}`} aria-label={typeof title === 'string' ? title : '对话框'} onCancel={event => { event.preventDefault(); onClose() }} onClick={event => { if (event.target === dialogRef.current) onClose() }}>
    <div className="skyui-modal-body">
      {title && <div className="skyui-modal-heading"><h3>{title}</h3><button type="button" className="skyui-icon-close" aria-label="关闭对话框" onClick={onClose}>×</button></div>}
      {children}
      {footer && <div className="skyui-modal-footer">{footer}</div>}
    </div>
  </dialog>
}

export function Drawer({ open, onClose, title, side = 'right', children, footer, className = '' }: { open: boolean; onClose: () => void; title?: ReactNode; side?: 'left' | 'right' | 'bottom'; children?: ReactNode; footer?: ReactNode; className?: string }) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])
  if (!open) return null
  return <div className="skyui-drawer-overlay" onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <aside role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : '侧边面板'} className={`skyui-drawer skyui-drawer-${side} ${className}`}>
      {title && <div className="skyui-modal-heading"><h3>{title}</h3><button type="button" className="skyui-icon-close" aria-label="关闭面板" onClick={onClose}>×</button></div>}
      <div className="skyui-drawer-content">{children}</div>
      {footer && <div className="skyui-modal-footer">{footer}</div>}
    </aside>
  </div>
}

type ToastVariant = 'info' | 'success' | 'error'
type ToastOptions = { variant?: ToastVariant; duration?: number }
type ToastItem = { id: number; message: string; variant: ToastVariant; duration: number }

const ToastContext = createContext<((message: string, options?: ToastOptions) => void) | null>(null)

export function ToastProvider({ children, duration = 3200 }: { children: ReactNode; duration?: number }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)
  const push = useCallback((message: string, options?: ToastOptions) => {
    counter.current += 1
    const id = counter.current
    setToasts(previous => [...previous, { id, message, variant: options?.variant ?? 'info', duration: options?.duration ?? duration }])
  }, [duration])
  const dismiss = useCallback((id: number) => setToasts(previous => previous.filter(toast => toast.id !== id)), [])
  return <ToastContext.Provider value={push}>
    {children}
    <div className="skyui-toasts" aria-label="通知">{toasts.map(toast => <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />)}</div>
  </ToastContext.Provider>
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), toast.duration)
    return () => window.clearTimeout(timer)
  }, [toast, onDismiss])
  const symbols = { info: 'i', success: '✓', error: '×' }
  return <div className={`skyui-toast skyui-toast-${toast.variant}`} role="status"><span className="skyui-toast-symbol" aria-hidden="true">{symbols[toast.variant]}</span><span className="skyui-toast-message">{toast.message}</span><button type="button" className="skyui-icon-close" aria-label="关闭提示" onClick={() => onDismiss(toast.id)}>×</button></div>
}

export function useToast() {
  const push = useContext(ToastContext)
  if (!push) throw new Error('useToast 必须在 <ToastProvider> 内使用。')
  return push
}

/* ------------------------------------------------------------------ */
/* 导航（Tabs / Accordion / Breadcrumb / Pagination / Steps）           */
/* ------------------------------------------------------------------ */

type TabItem = { id: string; label: ReactNode; content: ReactNode }

export function Tabs({ items, value, defaultValue, onChange, ariaLabel, className = '' }: { items: TabItem[]; value?: string; defaultValue?: string; onChange?: (id: string) => void; ariaLabel?: string; className?: string }) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id)
  const active = value ?? internal
  const baseId = useId()
  return <div className={`skyui-tabs ${className}`}>
    <div className="skyui-tabs-list" role="tablist" aria-label={ariaLabel}>
      {items.map(item => <button key={item.id} type="button" role="tab" id={`${baseId}-tab-${item.id}`} aria-selected={active === item.id} aria-controls={`${baseId}-panel-${item.id}`} className={active === item.id ? 'skyui-tab-active' : ''} onClick={() => { setInternal(item.id); onChange?.(item.id) }}>{item.label}</button>)}
    </div>
    {items.map(item => <div key={item.id} role="tabpanel" id={`${baseId}-panel-${item.id}`} aria-labelledby={`${baseId}-tab-${item.id}`} hidden={active !== item.id} className="skyui-tab-panel">{item.content}</div>)}
  </div>
}

type AccordionItem = { title: ReactNode; content: ReactNode }

export function Accordion({ items, defaultOpen = [], multiple = false, ariaLabel, className = '' }: { items: AccordionItem[]; defaultOpen?: number[]; multiple?: boolean; ariaLabel?: string; className?: string }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(defaultOpen))
  function toggle(index: number) {
    setOpen(previous => {
      const isOpen = previous.has(index)
      if (multiple) { const next = new Set(previous); if (isOpen) next.delete(index); else next.add(index); return next }
      return isOpen ? new Set<number>() : new Set([index])
    })
  }
  return <div className={`skyui-accordion ${className}`} aria-label={ariaLabel}>
    {items.map((item, index) => <div key={index} className="skyui-accordion-item" data-open={open.has(index)}>
      <button type="button" className="skyui-accordion-trigger" aria-expanded={open.has(index)} aria-controls={`skyui-acc-panel-${index}`} onClick={() => toggle(index)}>{item.title}<span className="skyui-accordion-icon" aria-hidden="true">+</span></button>
      <div id={`skyui-acc-panel-${index}`} role="region" hidden={!open.has(index)} className="skyui-accordion-panel">{item.content}</div>
    </div>)}
  </div>
}

export function Breadcrumb({ items, ariaLabel = '面包屑', className = '' }: { items: { label: ReactNode; onClick?: () => void; href?: string }[]; ariaLabel?: string; className?: string }) {
  return <nav className={`skyui-breadcrumb ${className}`} aria-label={ariaLabel}><ol>
    {items.map((item, index) => {
      const last = index === items.length - 1
      return <li key={index}>{index > 0 && <span aria-hidden="true">/</span>}{last ? <span aria-current="page">{item.label}</span> : item.href ? <a href={item.href}>{item.label}</a> : <button type="button" onClick={item.onClick}>{item.label}</button>}</li>
    })}
  </ol></nav>
}

export function Pagination({ page, pageCount, onChange, ariaLabel = '分页', className = '' }: { page: number; pageCount: number; onChange: (page: number) => void; ariaLabel?: string; className?: string }) {
  if (pageCount <= 0) return null
  const windowStart = Math.max(1, Math.min(page - 2, pageCount - 4))
  const windowEnd = Math.min(pageCount, windowStart + 4)
  const pages: number[] = []
  for (let value = windowStart; value <= windowEnd; value += 1) pages.push(value)
  return <div className={`skyui-pagination ${className}`} role="group" aria-label={ariaLabel}>
    <button type="button" aria-label="上一页" disabled={page <= 1} onClick={() => onChange(page - 1)}>←</button>
    {pages.map(value => <button key={value} type="button" aria-label={`第 ${value} 页`} aria-current={page === value ? 'page' : undefined} onClick={() => onChange(value)}>{value}</button>)}
    <button type="button" aria-label="下一页" disabled={page >= pageCount} onClick={() => onChange(page + 1)}>→</button>
  </div>
}

export function Steps({ items, current, ariaLabel = '步骤', className = '' }: { items: string[]; current: number; ariaLabel?: string; className?: string }) {
  return <ol className={`skyui-steps ${className}`} aria-label={ariaLabel}>
    {items.map((label, index) => <li key={label} className={current >= index + 1 ? 'is-current' : ''} aria-current={current === index + 1 ? 'step' : undefined}><span>{index + 1}</span>{label}</li>)}
  </ol>
}

/* ------------------------------------------------------------------ */
/* 数据展示（Progress / Slider / AvatarGroup / Tag / Table / 统计）      */
/* ------------------------------------------------------------------ */

export function Progress({ value, max = 100, label, className = '' }: { value: number; max?: number; label?: string; className?: string }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))
  return <div role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label} className={`skyui-progress ${className}`}><span style={{ width: `${percent}%` }} /></div>
}

export function Slider({ value, onChange, min = 0, max = 100, label, className = '' }: { value: number; onChange: (value: number) => void; min?: number; max?: number; label?: string; className?: string }) {
  return <input type="range" min={min} max={max} value={value} aria-label={label} className={`skyui-slider ${className}`} onChange={event => onChange(Number(event.target.value))} />
}

export function AvatarGroup({ people, max = 3, size = 'normal', className = '' }: { people: { name: string; src?: string }[]; max?: number; size?: 'normal' | 'large'; className?: string }) {
  const visible = people.slice(0, max)
  const overflow = people.length - visible.length
  return <div className={`skyui-avatar-group ${className}`}>
    {visible.map((person, index) => <Avatar key={person.name} name={person.name} src={person.src} size={size} tone={index % 2 ? 'light' : 'dark'} />)}
    {overflow > 0 && <span className={`skyui-avatar skyui-avatar-${size} skyui-avatar-light skyui-avatar-more`} aria-label={`还有 ${overflow} 位成员`}>+{overflow}</span>}
  </div>
}

export function Tag({ children, onRemove, className = '' }: { children: ReactNode; onRemove?: () => void; className?: string }) {
  return <span className={`skyui-tag ${className}`}>{children}{onRemove && <button type="button" className="skyui-icon-close skyui-tag-close" aria-label="移除标签" onClick={onRemove}>×</button>}</span>
}

export type TableColumn<T> = { key: string; header: ReactNode; render?: (row: T) => ReactNode; width?: number | string }

export function Table<T>({ columns, rows, caption, rowKey, empty, loading = false, sticky = false, expandable, className = '' }: { columns: TableColumn<T>[]; rows: T[]; caption?: string; rowKey?: (row: T, index: number) => React.Key; empty?: ReactNode; loading?: boolean; sticky?: boolean; expandable?: { expandedRowRender: (row: T) => ReactNode; rowExpandable?: (row: T) => boolean }; className?: string }) {
  const [expanded, setExpanded] = useState<Set<React.Key>>(new Set())
  const keyOf = (row: T, index: number) => rowKey ? rowKey(row, index) : index
  const toggle = (key: React.Key) => setExpanded(previous => {
    const next = new Set(previous)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    return next
  })
  const cellCount = columns.length + (expandable ? 1 : 0)
  return <div className={`skyui-table-wrap ${className}`}>
    <table className={`skyui-table ${sticky ? 'skyui-table-sticky' : ''}`}>
      {caption && <caption>{caption}</caption>}
      <thead><tr>
        {expandable && <th className="skyui-table-expand-head" scope="col"><span className="skyui-sr-only">展开操作</span></th>}
        {columns.map(column => <th key={column.key} scope="col" style={column.width !== undefined ? { width: column.width } : undefined}>{column.header}</th>)}
      </tr></thead>
      <tbody>
        {loading ? [0, 1, 2].map(index => <tr key={`skyui-skeleton-${index}`}>{Array.from({ length: cellCount }, (_, cell) => <td key={cell}><Skeleton /></td>)}</tr>)
          : rows.map((row, index) => {
            const key = keyOf(row, index)
            const isOpen = expanded.has(key)
            const canExpand = expandable && (expandable.rowExpandable ? expandable.rowExpandable(row) : true)
            return <Fragment key={key}>
              <tr>
                {expandable && <td className="skyui-table-expand-cell">{canExpand ? <button type="button" aria-expanded={isOpen} aria-label={isOpen ? '收起详情' : '展开详情'} className="skyui-table-expand-button" onClick={() => toggle(key)}>{isOpen ? '−' : '+'}</button> : null}</td>}
                {columns.map(column => <td key={column.key}>{column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '')}</td>)}
              </tr>
              {expandable && isOpen && canExpand && <tr className="skyui-table-expanded-row"><td colSpan={cellCount}>{expandable.expandedRowRender(row)}</td></tr>}
            </Fragment>
          })}
        {!loading && rows.length === 0 && <tr><td colSpan={cellCount}>{empty}</td></tr>}
      </tbody>
    </table>
  </div>
}

export function Divider({ label, vertical = false, className = '' }: { label?: string; vertical?: boolean; className?: string }) {
  if (vertical) return <span role="separator" aria-orientation="vertical" className={`skyui-divider skyui-divider-vertical ${className}`} />
  return <div role="separator" className={`skyui-divider ${className}`}>{label && <span>{label}</span>}</div>
}

/* ------------------------------------------------------------------ */
/* 布局与统计（Stack / Container / Statistic / Timeline / Descriptions） */
/* ------------------------------------------------------------------ */

export function Stack({ direction = 'column', gap = 12, align, justify, wrap = false, children, className = '' }: { direction?: 'row' | 'column'; gap?: number; align?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline'; justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between'; wrap?: boolean; children: ReactNode; className?: string }) {
  return <div className={className} style={{ display: 'flex', flexDirection: direction, gap, alignItems: align, justifyContent: justify, flexWrap: wrap ? 'wrap' : undefined }}>{children}</div>
}

export function Container({ children, maxWidth = 960, className = '' }: { children: ReactNode; maxWidth?: number; className?: string }) {
  return <div className={`skyui-container ${className}`} style={{ maxWidth }}>{children}</div>
}

export function Statistic({ label, value, delta, trend = 'up', className = '' }: { label: string; value: ReactNode; delta?: string; trend?: 'up' | 'down'; className?: string }) {
  return <div className={`skyui-statistic ${className}`}>
    <span className="skyui-statistic-label">{label}</span>
    <span className="skyui-statistic-row"><strong className="skyui-statistic-value">{value}</strong>{delta && <Badge variant="light">{trend === 'down' ? '↘' : '↗'} {delta}</Badge>}</span>
  </div>
}

export function Timeline({ items, ariaLabel = '时间线', className = '' }: { items: { title: ReactNode; description?: ReactNode; time?: string }[]; ariaLabel?: string; className?: string }) {
  return <ol className={`skyui-timeline ${className}`} aria-label={ariaLabel}>
    {items.map((item, index) => <li key={index}>{item.time && <small>{item.time}</small>}<strong>{item.title}</strong>{item.description && <p>{item.description}</p>}</li>)}
  </ol>
}

export function Descriptions({ items, className = '' }: { items: { label: string; value: ReactNode }[]; className?: string }) {
  return <dl className={`skyui-descriptions ${className}`}>
    {items.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
  </dl>
}

/* ------------------------------------------------------------------ */
/* v1.3.0 · 排版与容器（Title / Text / Paragraph / Kbd / Card / Label）   */
/* ------------------------------------------------------------------ */

export function Title({ level = 2, children, className = '' }: { level?: 1 | 2 | 3 | 4; children: ReactNode; className?: string }) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4'
  return <Tag className={`skyui-title skyui-title-${level} ${className}`}>{children}</Tag>
}

export function Text({ type = 'default', strong = false, underline = false, strikethrough = false, code = false, mark = false, children, className = '' }: { type?: 'default' | 'secondary' | 'muted'; strong?: boolean; underline?: boolean; strikethrough?: boolean; code?: boolean; mark?: boolean; children: ReactNode; className?: string }) {
  const classes = [`skyui-text`, type !== 'default' ? `skyui-text-${type}` : '', strong ? 'skyui-text-strong' : '', underline ? 'skyui-text-underline' : '', strikethrough ? 'skyui-text-delete' : '', className].filter(Boolean).join(' ')
  if (code) return <code className={`${classes} skyui-text-code`}>{children}</code>
  return <span className={classes}>{mark ? <mark>{children}</mark> : children}</span>
}

export function Paragraph({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`skyui-paragraph ${className}`}>{children}</p>
}

export function Kbd({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <kbd className={`skyui-kbd ${className}`}>{children}</kbd>
}

export function Card({ title, extra, footer, hoverable = false, padded = true, children, className = '' }: { title?: ReactNode; extra?: ReactNode; footer?: ReactNode; hoverable?: boolean; padded?: boolean; children?: ReactNode; className?: string }) {
  return <section className={`skyui-card ${hoverable ? 'skyui-card-hoverable' : ''} ${className}`}>
    {(title || extra) && <header className="skyui-card-header"><div className="skyui-card-title">{title}</div>{extra && <div className="skyui-card-extra">{extra}</div>}</header>}
    <div className={`skyui-card-body ${padded ? '' : 'skyui-card-body-flush'}`}>{children}</div>
    {footer && <footer className="skyui-card-footer">{footer}</footer>}
  </section>
}

export function Label({ children, htmlFor, required = false, className = '' }: { children: ReactNode; htmlFor?: string; required?: boolean; className?: string }) {
  return <label htmlFor={htmlFor} className={`skyui-label ${className}`}>{children}{required && <span className="skyui-label-required" aria-hidden="true">*</span>}</label>
}

/* ------------------------------------------------------------------ */
/* v1.3.0 · 选择控件（Segmented / RadioGroup / Toggle / Rate）            */
/* ------------------------------------------------------------------ */

type ChoiceOption = { value: string; label: ReactNode; disabled?: boolean }

function normalizeOptions(options: (string | ChoiceOption)[]): ChoiceOption[] {
  return options.map(option => typeof option === 'string' ? { value: option, label: option } : option)
}

export function Segmented({ options, value, onChange, ariaLabel, size = 'md', className = '' }: { options: (string | ChoiceOption)[]; value: string; onChange: (value: string) => void; ariaLabel?: string; size?: 'sm' | 'md'; className?: string }) {
  return <div className={`skyui-segmented skyui-segmented-${size} ${className}`} role="radiogroup" aria-label={ariaLabel}>
    {normalizeOptions(options).map(option => <button key={option.value} type="button" role="radio" aria-checked={value === option.value} disabled={option.disabled} className={value === option.value ? 'skyui-segmented-active' : ''} onClick={() => onChange(option.value)}>{option.label}</button>)}
  </div>
}

export function RadioGroup({ options, value, onChange, name, ariaLabel, direction = 'column', className = '' }: { options: (string | ChoiceOption)[]; value: string; onChange: (value: string) => void; name?: string; ariaLabel?: string; direction?: 'row' | 'column'; className?: string }) {
  const generatedId = useId()
  const groupName = name || `skyui-radio-${generatedId}`
  return <div className={`skyui-radio-group skyui-radio-group-${direction} ${className}`} role="radiogroup" aria-label={ariaLabel}>
    {normalizeOptions(options).map(option => <label key={option.value} className="skyui-radio"><input type="radio" name={groupName} value={option.value} checked={value === option.value} disabled={option.disabled} onChange={() => onChange(option.value)} /><span>{option.label}</span></label>)}
  </div>
}

export function Toggle({ pressed, onChange, children, ariaLabel, className = '' }: { pressed: boolean; onChange: (pressed: boolean) => void; children: ReactNode; ariaLabel?: string; className?: string }) {
  return <button type="button" aria-pressed={pressed} aria-label={ariaLabel} className={`skyui-toggle ${pressed ? 'skyui-toggle-pressed' : ''} ${className}`} onClick={() => onChange(!pressed)}>{children}</button>
}

export function ToggleGroup({ options, value, onChange, multiple = false, ariaLabel, className = '' }: { options: (string | ChoiceOption)[]; value: string[]; onChange: (value: string[]) => void; multiple?: boolean; ariaLabel?: string; className?: string }) {
  function toggle(optionValue: string) {
    const active = value.includes(optionValue)
    if (multiple) onChange(active ? value.filter(item => item !== optionValue) : [...value, optionValue])
    else onChange(active ? [] : [optionValue])
  }
  return <div className={`skyui-toggle-group ${className}`} role="group" aria-label={ariaLabel}>
    {normalizeOptions(options).map(option => <Toggle key={option.value} pressed={value.includes(option.value)} onChange={() => toggle(option.value)} ariaLabel={typeof option.label === 'string' ? option.label : option.value}>{option.label}</Toggle>)}
  </div>
}

export function Rate({ count = 5, value = 0, onChange, allowClear = true, ariaLabel = '评分', className = '' }: { count?: number; value?: number; onChange?: (value: number) => void; allowClear?: boolean; ariaLabel?: string; className?: string }) {
  return <div className={`skyui-rate ${className}`} role="radiogroup" aria-label={ariaLabel}>
    {Array.from({ length: count }, (_, index) => {
      const star = index + 1
      return <button key={star} type="button" role="radio" aria-checked={value === star} aria-label={`${star} 星`} className={value >= star ? 'skyui-rate-star skyui-rate-on' : 'skyui-rate-star'} onClick={() => onChange?.(allowClear && value === star ? 0 : star)}>★</button>
    })}
  </div>
}

/* ------------------------------------------------------------------ */
/* v1.3.0 · 浮层扩展（Popover / HoverCard / Spin）                        */
/* ------------------------------------------------------------------ */

export function Popover({ trigger, content, align = 'start', ariaLabel = '气泡卡片', open, onOpenChange, className = '' }: { trigger: ReactNode; content: ReactNode; align?: 'start' | 'end'; ariaLabel?: string; open?: boolean; onOpenChange?: (open: boolean) => void; className?: string }) {
  const [internal, setInternal] = useState(false)
  const isOpen = open ?? internal
  const rootRef = useRef<HTMLDivElement>(null)
  function setOpen(value: boolean) {
    if (open === undefined) setInternal(value)
    onOpenChange?.(value)
  }
  useEffect(() => {
    if (!isOpen) return
    function onPointerDown(event: PointerEvent) { if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false) }
    function onKeyDown(event: KeyboardEvent) { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown) }
  }, [isOpen])
  // trigger 已是可交互元素时克隆注入交互属性，而不是再包一层 <button>：
  // 包层会造成 button 嵌套 button 的无效 HTML，直接引发 SSR 水合失败。
  // 可克隆的三类：内在 button / a、自定义组件（如 <Button>，渲染出 button）；
  // Fragment 与普通内在元素（span 等）没有自己的点击语义，仍包 <button> 保持键盘可达。
  const clonableTrigger = isValidElement(trigger) && trigger.type !== Fragment && (typeof trigger.type === 'string' ? ['button', 'a'].includes(trigger.type) : true)
    ? (trigger as ReactElement<{ onClick?: (event: ReactMouseEvent<HTMLElement>) => void }>)
    : null
  const triggerProps = {
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': isOpen,
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      clonableTrigger?.props.onClick?.(event)
      setOpen(!isOpen)
    },
  }
  return <div ref={rootRef} className={`skyui-popover ${className}`}>
    {clonableTrigger
      ? cloneElement(clonableTrigger, triggerProps)
      : <button type="button" className="skyui-popover-trigger" {...triggerProps}>{trigger}</button>}
    {isOpen && <div className={`skyui-popover-panel skyui-popover-${align}`} role="dialog" aria-label={ariaLabel}>{content}</div>}
  </div>
}

export function HoverCard({ content, children, className = '' }: { content: ReactNode; children: ReactNode; className?: string }) {
  return <span className={`skyui-hovercard ${className}`} tabIndex={0}>{children}<span className="skyui-hovercard-panel" role="tooltip">{content}</span></span>
}

export function Spin({ size = 'md', label = '加载中', className = '' }: { size?: 'sm' | 'md' | 'lg'; label?: string; className?: string }) {
  return <span role="status" aria-label={label} className={`skyui-spin skyui-spin-${size} ${className}`}><span className="skyui-spin-ring" aria-hidden="true" /></span>
}

/* ------------------------------------------------------------------ */
/* v1.3.0 · 表单抽象（useForm / FormItem）                                */
/* ------------------------------------------------------------------ */

type FormRule = { required?: boolean; pattern?: RegExp; min?: number; max?: number; message?: string }
type FormRules<T> = { [K in keyof T]?: FormRule }

function validateField(value: unknown, rule: FormRule | undefined): string | null {
  if (!rule) return null
  const text = value === undefined || value === null ? '' : String(value)
  if (rule.required && text.trim() === '') return rule.message || '此项为必填。'
  if (rule.pattern && text !== '' && !rule.pattern.test(text)) return rule.message || '格式不正确。'
  if (typeof value === 'number' && rule.min !== undefined && value < rule.min) return rule.message || `不能小于 ${rule.min}。`
  if (typeof value === 'number' && rule.max !== undefined && value > rule.max) return rule.message || `不能大于 ${rule.max}。`
  return null
}

export function useForm<T extends Record<string, unknown>>({ initialValues, rules, onSubmit }: { initialValues: T; rules?: FormRules<T>; onSubmit?: (values: T) => void }) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  function setField<K extends keyof T>(name: K, value: T[K]) {
    setValues(previous => ({ ...previous, [name as string]: value }))
    if (rules?.[name]) setErrors(previous => ({ ...previous, [name]: validateField(value, rules[name]) ?? undefined }))
  }
  function handleSubmit(event?: FormEvent) {
    event?.preventDefault()
    const nextErrors: Partial<Record<keyof T, string>> = {}
    for (const name of Object.keys(initialValues) as (keyof T)[]) {
      const message = validateField(values[name], rules?.[name])
      if (message) nextErrors[name] = message
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSubmit?.(values)
  }
  return { values, errors, setField, handleSubmit }
}

export function FormItem({ label, error, htmlFor, required = false, children }: { label: string; error?: string; htmlFor?: string; required?: boolean; children: ReactNode }) {
  return <div className={`skyui-form-item ${error ? 'skyui-form-item-invalid' : ''}`}>
    <Label htmlFor={htmlFor} required={required}>{label}</Label>
    {children}
    {error && <small className="skyui-form-item-error" role="alert">{error}</small>}
  </div>
}

/* ------------------------------------------------------------------ */
/* v1.3.0 · 命令面板（Command）                                           */
/* ------------------------------------------------------------------ */

type CommandItem = { id: string; label: string; group?: string; onSelect?: () => void }

export function Command({ open, onClose, items, placeholder = '搜索命令…', emptyText = '没有匹配的命令。', ariaLabel = '命令面板' }: { open: boolean; onClose: () => void; items: CommandItem[]; placeholder?: string; emptyText?: string; ariaLabel?: string }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const keyword = query.trim().toLowerCase()
  const filtered = keyword === '' ? items : items.filter(item => item.label.toLowerCase().includes(keyword))
  const active = filtered[Math.min(activeIndex, Math.max(0, filtered.length - 1))]
  function select(item: CommandItem | undefined) {
    if (!item) return
    item.onSelect?.()
    setQuery('')
    setActiveIndex(0)
    onClose()
  }
  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActiveIndex(index => Math.min(index + 1, filtered.length - 1)) }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActiveIndex(index => Math.max(index - 1, 0)) }
    if (event.key === 'Enter') { event.preventDefault(); select(active) }
  }
  return <Modal open={open} onClose={() => { setQuery(''); setActiveIndex(0); onClose() }} className="skyui-command" title={<span className="skyui-command-heading">{ariaLabel}</span>}>
    <input className="skyui-input" autoFocus placeholder={placeholder} aria-label={placeholder} value={query} onChange={event => { setQuery(event.target.value); setActiveIndex(0) }} onKeyDown={onKeyDown} />
    <ul className="skyui-command-list" role="listbox" aria-label={`${ariaLabel}结果`}>
      {filtered.map((item, index) => <li key={item.id} role="option" aria-selected={item === active} className={item === active ? 'skyui-command-active' : ''} onMouseEnter={() => setActiveIndex(index)} onClick={() => select(item)}>{item.group && <small>{item.group}</small>}<span>{item.label}</span></li>)}
      {filtered.length === 0 && <li className="skyui-command-empty">{emptyText}</li>}
    </ul>
  </Modal>
}

/* ------------------------------------------------------------------ */
/* v1.3.0 · 日期（Calendar / DatePicker）                                 */
/* ------------------------------------------------------------------ */

function startOfMonth(date: Date) { return new Date(date.getFullYear(), date.getMonth(), 1) }
function sameDay(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate() }
function isSameMonth(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() }
function buildMonthGrid(viewMonth: Date): Date[] {
  const first = startOfMonth(viewMonth)
  const offset = (first.getDay() + 6) % 7
  const cells: Date[] = []
  for (let index = 0; index < 42; index += 1) cells.push(new Date(first.getFullYear(), first.getMonth(), 1 - offset + index))
  return cells
}

export function Calendar({ value, onChange, minDate, maxDate, className = '' }: { value?: Date | null; onChange?: (date: Date) => void; minDate?: Date; maxDate?: Date; className?: string }) {
  const today = new Date()
  const initial = value ?? today
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(initial))
  const [cursor, setCursor] = useState(() => new Date(initial))
  const cells = buildMonthGrid(viewMonth)
  function disabled(date: Date) {
    if (minDate && date < startOfDay(minDate)) return true
    if (maxDate && date > startOfDay(maxDate)) return true
    return false
  }
  function onKeyDown(event: ReactKeyboardEvent<HTMLTableSectionElement>) {
    const step: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    if (event.key in step) {
      event.preventDefault()
      const next = new Date(cursor)
      next.setDate(next.getDate() + step[event.key])
      setCursor(next)
      if (!isSameMonth(next, viewMonth)) setViewMonth(startOfMonth(next))
      return
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault()
      const next = new Date(cursor)
      next.setMonth(next.getMonth() + (event.key === 'PageUp' ? -1 : 1))
      setCursor(next)
      setViewMonth(startOfMonth(next))
    }
  }
  return <div className={`skyui-calendar ${className}`}>
    <div className="skyui-calendar-head">
      <button type="button" aria-label="上一个月" onClick={() => { const next = new Date(viewMonth); next.setMonth(next.getMonth() - 1); setViewMonth(next) }}>←</button>
      <strong>{viewMonth.getFullYear()} 年 {viewMonth.getMonth() + 1} 月</strong>
      <button type="button" aria-label="下一个月" onClick={() => { const next = new Date(viewMonth); next.setMonth(next.getMonth() + 1); setViewMonth(next) }}>→</button>
    </div>
    <table className="skyui-calendar-grid" role="grid" aria-label="日期选择">
      <thead><tr>{['一', '二', '三', '四', '五', '六', '日'].map(weekday => <th key={weekday} scope="col" abbr={weekday}>{weekday}</th>)}</tr></thead>
      <tbody onKeyDown={onKeyDown}>
        {Array.from({ length: 6 }, (_, week) => <tr key={week}>{cells.slice(week * 7, week * 7 + 7).map(date => {
          const selected = value ? sameDay(date, value) : false
          const outside = !isSameMonth(date, viewMonth)
          return <td key={date.toISOString()} role="gridcell" aria-selected={selected}>
            <button type="button" tabIndex={sameDay(date, cursor) ? 0 : -1} className={[selected ? 'skyui-calendar-selected' : '', outside ? 'skyui-calendar-outside' : '', sameDay(date, today) ? 'skyui-calendar-today' : ''].filter(Boolean).join(' ')} disabled={disabled(date)} aria-label={`${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`} onClick={() => { onChange?.(date); setCursor(date) }} onFocus={() => setCursor(date)}>{date.getDate()}</button>
          </td>
        })}</tr>)}
      </tbody>
    </table>
  </div>
}

function startOfDay(date: Date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()) }

export function DatePicker({ value, onChange, placeholder = '选择日期', label, minDate, maxDate, className = '' }: { value?: Date | null; onChange?: (date: Date) => void; placeholder?: string; label?: string; minDate?: Date; maxDate?: Date; className?: string }) {
  const [open, setOpen] = useState(false)
  const display = value ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}` : ''
  return <Popover className={className} ariaLabel="日期选择" open={open} onOpenChange={setOpen} trigger={<span className="skyui-datepicker-trigger">{label && <span className="skyui-datepicker-label">{label}</span>}{display || <span className="skyui-datepicker-placeholder">{placeholder}</span>}<span aria-hidden="true">▾</span></span>} content={<Calendar value={value} minDate={minDate} maxDate={maxDate} onChange={date => { onChange?.(date); setOpen(false) }} />} />
}

/* ------------------------------------------------------------------ */
/* v1.3.0 · 展示增强（Carousel / ToggleGroup 之外的重组件）                */
/* ------------------------------------------------------------------ */

export function Carousel({ items, autoPlay = false, interval = 4000, ariaLabel = '轮播' }: { items: ReactNode[]; autoPlay?: boolean; interval?: number; ariaLabel?: string }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (!autoPlay || items.length <= 1) return
    const timer = window.setInterval(() => setIndex(current => (current + 1) % items.length), interval)
    return () => window.clearInterval(timer)
  }, [autoPlay, interval, items.length])
  return <div className="skyui-carousel" role="group" aria-label={ariaLabel} aria-roledescription="轮播">
    <div className="skyui-carousel-viewport">{items.map((item, slide) => <div key={slide} className="skyui-carousel-slide" role="group" aria-roledescription="幻灯片" aria-label={`第 ${slide + 1} 张，共 ${items.length} 张`} aria-hidden={index !== slide} hidden={index !== slide}>{item}</div>)}</div>
    {items.length > 1 && <>
      <button type="button" className="skyui-carousel-arrow skyui-carousel-prev" aria-label="上一张" onClick={() => setIndex(current => (current - 1 + items.length) % items.length)}>←</button>
      <button type="button" className="skyui-carousel-arrow skyui-carousel-next" aria-label="下一张" onClick={() => setIndex(current => (current + 1) % items.length)}>→</button>
      <div className="skyui-carousel-dots" role="tablist" aria-label="选择幻灯片">{items.map((_item, slide) => <button key={slide} type="button" role="tab" aria-selected={index === slide} aria-label={`第 ${slide + 1} 张`} className={index === slide ? 'skyui-carousel-dot-active' : ''} onClick={() => setIndex(slide)} />)}</div>
    </>}
  </div>
}

/* ------------------------------------------------------------------ */
/* v1.3.0 · 布局与配置（Grid / GridItem / ConfigProvider）                */
/* ------------------------------------------------------------------ */

export function Grid({ cols = 12, gap = 12, children, className = '' }: { cols?: number; gap?: number; children: ReactNode; className?: string }) {
  return <GridContext.Provider value={cols}><div className={`skyui-grid ${className}`} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap }}>{children}</div></GridContext.Provider>
}

export function GridItem({ span = 12, children, className = '' }: { span?: number; children: ReactNode; className?: string }) {
  const cols = useContext(GridContext)
  const clamped = Math.max(1, Math.min(span, cols))
  return <div className={`skyui-grid-item ${className}`} style={{ gridColumn: `span ${clamped}` }}>{children}</div>
}

type SkyUIConfig = { theme?: 'light' | 'dark'; size?: 'sm' | 'md' | 'lg' }

export function ConfigProvider({ theme, size, children, className = '' }: SkyUIConfig & { children: ReactNode; className?: string }) {
  const themeClass = theme ? `skyui-theme-${theme}` : ''
  return <div className={`${themeClass} ${className}`}><ConfigContext.Provider value={{ theme, size }}>{children}</ConfigContext.Provider></div>
}

export function useSkyUIConfig() {
  return useContext(ConfigContext)
}

/* ------------------------------------------------------------------ */
/* 数据展示                                                            */
/* ------------------------------------------------------------------ */

const fmtNumber = (value: number, decimals = 0) => value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

/* 迷你趋势线：表格行内嵌走势，无坐标轴无交互 */
export function Sparkline({ data, width = 72, height = 20, className = '', label }: { data: number[]; width?: number; height?: number; className?: string; label?: string }) {
  if (data.length < 2) return <span className={`skyui-sparkline-empty ${className}`} aria-hidden="true">—</span>
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const pad = 2
  const points = data.map((value, index) => {
    const x = pad + (index / (data.length - 1)) * (width - pad * 2)
    const y = height - pad - ((value - min) / span) * (height - pad * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const last = points.split(' ').pop()!.split(',')
  return <svg className={`skyui-sparkline ${className}`} width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label || `趋势，最新值 ${fmtNumber(data[data.length - 1])}`} preserveAspectRatio="none">
    <polyline points={points} fill="none" stroke="var(--skyui-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={last[0]} cy={last[1]} r="2" fill="var(--skyui-ink)" />
  </svg>
}

/* 折线趋势图：多序列 + 网格线 + 端点标注，用于周期增长回看 */
type LineChartSeries = { name: string; data: number[]; dashed?: boolean }

export function LineChart({ series, labels, height = 180, decimals = 0, className = '', ariaLabel = '增长趋势图', showGrid = true }: { series: LineChartSeries[]; labels?: string[]; height?: number; decimals?: number; className?: string; ariaLabel?: string; showGrid?: boolean }) {
  const width = 620
  const padL = 52
  const padR = 18
  const padT = 14
  const padB = 26
  const all = series.flatMap(item => item.data)
  if (!all.length) return <div className={`skyui-chart-empty ${className}`}>暂无数据</div>
  const rawMin = Math.min(...all)
  const rawMax = Math.max(...all)
  // 值域贴住数据范围，但至少留出一格间距，避免单值系列退化成一条贴边直线
  const span = rawMax - rawMin
  const pad = span === 0 ? Math.abs(rawMax) * 0.1 || 1 : span * 0.12
  const min = rawMin - pad
  const max = rawMax + pad
  const plotW = width - padL - padR
  const plotH = height - padT - padB
  const longest = Math.max(...series.map(item => item.data.length))
  const xAt = (index: number) => padL + (longest === 1 ? plotW / 2 : (index / (longest - 1)) * plotW)
  const yAt = (value: number) => padT + plotH - ((value - min) / (max - min)) * plotH
  const ticks = [max, (max + min) / 2, min]
  return <figure className={`skyui-chart ${className}`}>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel} style={{ width: '100%', height, display: 'block' }}>
      {showGrid && ticks.map((tick, index) => <g key={index}>
        <line x1={padL} y1={yAt(tick)} x2={width - padR} y2={yAt(tick)} stroke="var(--skyui-line)" strokeWidth="1" />
        <text x={padL - 8} y={yAt(tick) + 3} textAnchor="end" className="skyui-chart-axis">{fmtNumber(tick, decimals)}</text>
      </g>)}
      {series.map(item => {
        const points = item.data.map((value, index) => `${xAt(index).toFixed(1)},${yAt(value).toFixed(1)}`).join(' ')
        return <g key={item.name}>
          <polyline points={points} fill="none" stroke="var(--skyui-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={item.dashed ? '4 3' : undefined} />
          {item.data.map((value, index) => <circle key={index} cx={xAt(index)} cy={yAt(value)} r="2.5" fill="var(--skyui-ink)" />)}
        </g>
      })}
      {labels && labels.length > 0 && <>
        <text x={padL} y={height - 8} className="skyui-chart-label">{labels[0]}</text>
        <text x={width - padR} y={height - 8} textAnchor="end" className="skyui-chart-label">{labels[labels.length - 1]}</text>
      </>}
    </svg>
    {series.length > 1 && <figcaption className="skyui-chart-legend">{series.map(item => <span key={item.name}><i className={item.dashed ? 'dashed' : ''} />{item.name}</span>)}</figcaption>}
  </figure>
}

/* 环形仪表：单一百分比水位，比进度条更适合「占比 / 完成度」 */
export function Gauge({ value, max = 100, size = 96, thickness = 7, label, decimals = 0, className = '' }: { value: number; max?: number; size?: number; thickness?: number; label?: string; decimals?: number; className?: string }) {
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = max === 0 ? 0 : Math.max(0, Math.min(1, value / max))
  return <div className={`skyui-gauge ${className}`} style={{ width: size, height: size }} role="img" aria-label={label || `完成度 ${fmtNumber(value, decimals)} / ${fmtNumber(max, decimals)}`}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--skyui-line)" strokeWidth={thickness} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--skyui-ink)" strokeWidth={thickness} strokeLinecap="round" strokeDasharray={`${circumference * ratio} ${circumference}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} className="skyui-gauge-arc" />
    </svg>
    <span className="skyui-gauge-text" style={{ fontSize: size / 4.4 }}>{fmtNumber(value, decimals)}<small>%</small></span>
  </div>
}

/* 阈值水位条：在进度条上标出分级刻度线，让「离阈值还差多少」一眼可见 */
export function Meter({ value, max = 100, thresholds = [], showValue = true, label, className = '' }: { value: number; max?: number; thresholds?: number[]; showValue?: boolean; label?: string; className?: string }) {
  const ratio = max === 0 ? 0 : Math.max(0, Math.min(1, value / max))
  return <div className={`skyui-meter ${className}`}>
    {showValue && <span className="skyui-meter-value">{fmtNumber(value)}<small>%</small></span>}
    <div className="skyui-meter-track" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label || `水位 ${fmtNumber(value)}%`}>
      <span className="skyui-meter-fill" style={{ width: `${ratio * 100}%` }} />
      {thresholds.map(mark => <i key={mark} className="skyui-meter-tick" style={{ left: `${(mark / max) * 100}%` }} />)}
    </div>
  </div>
}

/* 数字滚动：把大数值变化可视化，decimals 控制小数位 */
export function Counter({ value, decimals = 0, duration = 1100, suffix, className = '' }: { value: number; decimals?: number; duration?: number; suffix?: string; className?: string }) {
  const [display, setDisplay] = useState(0)
  const frame = useRef<number>(0)
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  useEffect(() => {
    if (reduced) { setDisplay(value); return }
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [value, duration, reduced])
  return <b className={`skyui-counter ${className}`}>{fmtNumber(display, decimals)}{suffix && <small>{suffix}</small>}</b>
}

/* 阈值图例：把「60% 评估 / 80% 执行」这类分级策略显式展示，避免读表的人自己换算 */
export function ThresholdLegend({ items, className = '' }: { items: { threshold: number; label: string }[]; className?: string }) {
  return <div className={`skyui-threshold ${className}`}>
    {items.map(item => <span key={item.threshold}><b>{item.threshold}%</b>{item.label}</span>)}
  </div>
}

/* 搜索框：表格/列表的即时过滤入口 */
export function SearchInput({ value, onChange, placeholder = '搜索…', ariaLabel = '搜索', className = '' }: { value: string; onChange: (value: string) => void; placeholder?: string; ariaLabel?: string; className?: string }) {
  return <div className={`skyui-search ${className}`}>
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" /></svg>
    <input type="search" value={value} placeholder={placeholder} aria-label={ariaLabel} onChange={event => onChange(event.target.value)} />
    {value && <button type="button" aria-label="清空搜索" onClick={() => onChange('')}>×</button>}
  </div>
}

/* 筛选胶囊：单选分类切换，比下拉更适合少量并列选项 */
export function FilterChips({ options, value, onChange, ariaLabel = '筛选', className = '' }: { options: { value: string; label: string; count?: number }[]; value: string; onChange: (value: string) => void; ariaLabel?: string; className?: string }) {
  return <div className={`skyui-chips ${className}`} role="group" aria-label={ariaLabel}>
    {options.map(option => <button key={option.value} type="button" aria-pressed={option.value === value} className={option.value === value ? 'active' : ''} onClick={() => onChange(option.value)}>
      {option.label}{option.count !== undefined && <span>{option.count}</span>}
    </button>)}
  </div>
}
