import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import './ui.css'

/* ------------------------------------------------------------------ */
/* 基础控件                                                            */
/* ------------------------------------------------------------------ */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' | 'lg'; loading?: boolean }

export function Button({ variant = 'primary', size = 'md', loading = false, className = '', type = 'button', disabled, children, ...props }: ButtonProps) {
  const sizeClass = size === 'md' ? '' : ` skyui-button-${size}`
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

export function Table<T>({ columns, rows, caption, rowKey, empty, className = '' }: { columns: TableColumn<T>[]; rows: T[]; caption?: string; rowKey?: (row: T, index: number) => React.Key; empty?: ReactNode; className?: string }) {
  return <div className={`skyui-table-wrap ${className}`}>
    <table className="skyui-table">
      {caption && <caption>{caption}</caption>}
      <thead><tr>{columns.map(column => <th key={column.key} scope="col" style={column.width !== undefined ? { width: column.width } : undefined}>{column.header}</th>)}</tr></thead>
      <tbody>
        {rows.map((row, index) => <tr key={rowKey ? rowKey(row, index) : index}>{columns.map(column => <td key={column.key}>{column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '')}</td>)}</tr>)}
        {rows.length === 0 && <tr><td colSpan={columns.length}>{empty}</td></tr>}
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
