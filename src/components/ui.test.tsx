import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Accordion, Alert, Avatar, Button, Checkbox, Modal, Statistic, Tabs, Tag, ToastProvider, Tooltip, useToast } from './ui'

describe('基础组件', () => {
  it('Button 渲染加载态并禁用点击', () => {
    const onClick = vi.fn()
    render(<Button loading onClick={onClick}>提交</Button>)
    const button = screen.getByRole('button', { name: '提交' })
    expect(button.getAttribute('aria-busy')).toBe('true')
    expect(button.hasAttribute('disabled')).toBe(true)
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('Avatar 支持 src 加载失败后回退为首字符', () => {
    const { container } = render(<Avatar name="Lin" src="/broken.png" />)
    const image = container.querySelector('img')
    expect(image).not.toBeNull()
    fireEvent.error(image as HTMLElement)
    expect(screen.getByLabelText('Lin').textContent).toContain('L')
  })

  it('Checkbox 支持 indeterminate 半选态', () => {
    render(<Checkbox label="全选" indeterminate checked={false} onChange={() => {}} />)
    expect((screen.getByLabelText('全选') as HTMLInputElement).indeterminate).toBe(true)
  })

  it('Alert 可关闭', () => {
    render(<Alert title="已保存" variant="success" dismissible onClose={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: '关闭通知' }))
    expect(screen.queryByText('已保存')).toBeNull()
  })
})

describe('导航与浮层组件', () => {
  it('Tabs 切换面板', () => {
    render(<Tabs items={[{ id: 'a', label: '概览', content: '内容甲' }, { id: 'b', label: '动态', content: '内容乙' }]} />)
    expect((screen.getByText('内容乙') as HTMLElement).hidden).toBe(true)
    fireEvent.click(screen.getByRole('tab', { name: '动态' }))
    expect((screen.getByText('内容乙') as HTMLElement).hidden).toBe(false)
    expect((screen.getByText('内容甲') as HTMLElement).hidden).toBe(true)
  })

  it('Accordion 单开模式互斥', () => {
    render(<Accordion items={[{ title: '问题一', content: '答案一' }, { title: '问题二', content: '答案二' }]} />)
    fireEvent.click(screen.getByRole('button', { name: /问题二/ }))
    expect(screen.getByRole('button', { name: /问题二/ }).getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('button', { name: /问题一/ }).getAttribute('aria-expanded')).toBe('false')
  })

  it('Tag 点击移除按钮触发回调', () => {
    const onRemove = vi.fn()
    render(<Tag onRemove={onRemove}>设计系统</Tag>)
    fireEvent.click(screen.getByRole('button', { name: '移除标签' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('Tooltip 渲染提示内容', () => {
    render(<Tooltip content="保存并发布"><button type="button">发布</button></Tooltip>)
    expect(document.querySelector('.skyui-tooltip')?.getAttribute('data-tip')).toBe('保存并发布')
  })

  it('Modal 关闭时不处于打开状态', () => {
    render(<Modal open={false} onClose={() => {}} title="标题"><p>内容</p></Modal>)
    const dialog = document.querySelector('dialog')
    expect(dialog).not.toBeNull()
    expect(dialog?.open ?? true).toBe(false)
  })
})

describe('数据组件', () => {
  it('Statistic 渲染数值与涨幅', () => {
    render(<Statistic label="本月访问量" value="2,846" delta="12.8%" />)
    expect(screen.getByText('2,846')).not.toBeNull()
    expect(screen.getByText((_, element) => element?.textContent === '↗ 12.8%')).not.toBeNull()
  })
})

describe('Toast', () => {
  it('useToast 在 Provider 内推送通知', () => {
    function Trigger() {
      const toast = useToast()
      return <button type="button" onClick={() => toast('已保存', { variant: 'success' })}>保存</button>
    }
    render(<ToastProvider duration={100}><Trigger /></ToastProvider>)
    fireEvent.click(screen.getByRole('button', { name: '保存' }))
    expect(screen.getByText('已保存')).not.toBeNull()
  })

  it('useToast 在 Provider 外抛出错误', () => {
    function Broken() {
      useToast()
      return null
    }
    expect(() => render(<Broken />)).toThrow('useToast 必须在 <ToastProvider> 内使用。')
  })
})
