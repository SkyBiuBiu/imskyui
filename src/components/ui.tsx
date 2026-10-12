import { useId } from 'react'
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import './ui.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }

export function Button({ variant = 'primary', className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={`skyui-button skyui-button-${variant} ${className}`} {...props} />
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; invalid?: boolean; error?: string; helpText?: string }

export function Input({ label, invalid, error, helpText, className = '', id, 'aria-describedby': describedBy, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id || generatedId
  const message = invalid ? error || '请输入有效的内容。' : helpText
  const messageId = `${inputId}-message`
  const input = <input {...props} id={inputId} className={`skyui-input ${invalid ? 'skyui-input-invalid' : ''} ${className}`} aria-invalid={invalid || undefined} aria-describedby={[describedBy, message ? messageId : ''].filter(Boolean).join(' ') || undefined} />
  return <div className="skyui-input-label">{label && <label htmlFor={inputId}>{label}</label>}{input}{message && <small id={messageId}>{message}</small>}</div>
}

export function Switch({ checked, onChange, label, disabled = false }: { checked: boolean; onChange: (checked: boolean) => void; label: string; disabled?: boolean }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} className={`skyui-switch ${checked ? 'skyui-switch-on' : ''}`} onClick={() => onChange(!checked)}><span /></button>
}

export function Badge({ children, variant = 'light' }: { children: ReactNode; variant?: 'light' | 'dark' | 'outline' }) {
  return <span className={`skyui-badge skyui-badge-${variant}`}>{children}</span>
}

export function Avatar({ name, size = 'normal', tone = 'dark' }: { name: string; size?: 'normal' | 'large'; tone?: 'dark' | 'light' }) {
  return <span className={`skyui-avatar skyui-avatar-${size} skyui-avatar-${tone}`} aria-label={name}>{name.slice(0, 1)}</span>
}

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: string }

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return <label className={`skyui-checkbox ${className}`}><input {...props} type="checkbox" /><span>{label}</span></label>
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

export function Alert({ title, children, variant = 'info' }: { title: string; children?: ReactNode; variant?: 'info' | 'success' | 'warning' | 'error' }) {
  const symbols = { info: 'i', success: '✓', warning: '!', error: '×' }
  return <div className={`skyui-alert skyui-alert-${variant}`} role={variant === 'error' ? 'alert' : 'status'}><span className="skyui-alert-symbol" aria-hidden="true">{symbols[variant]}</span><div><strong>{title}</strong>{children && <div className="skyui-alert-description">{children}</div>}</div></div>
}

export function Skeleton({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={`skyui-skeleton ${className}`} aria-hidden="true" />
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="skyui-empty-state"><span className="skyui-empty-symbol" aria-hidden="true"><span /></span><h4>{title}</h4><p>{description}</p>{action}</div>
}

export function HttpStatusPage({ code, title, description, actions }: { code: number; title: string; description: string; actions?: ReactNode }) {
  return <section className={`skyui-http-page skyui-http-${Math.floor(code / 100)}xx`} aria-label={`${code} ${title}`}><span className="skyui-http-label">skyui / HTTP {Math.floor(code / 100)}xx</span><div className="skyui-http-art" aria-hidden="true"><span /><span /><span /></div><strong className="skyui-http-code">{code}</strong><h4>{title}</h4><p>{description}</p>{actions && <div className="skyui-http-actions">{actions}</div>}</section>
}
