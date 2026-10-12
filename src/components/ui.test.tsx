import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Accordion, Alert, Avatar, Button, Calendar, Card, Carousel, Checkbox, Command, ConfigProvider, DatePicker, FormItem, Grid, GridItem, HoverCard, Kbd, Modal, Popover, RadioGroup, Rate, Segmented, Spin, Statistic, Table, Tabs, Tag, Text, Title, ToastProvider, Toggle, Tooltip, useForm, useToast } from './ui'

afterEach(cleanup)

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

describe('v1.3.0 排版与容器', () => {
  it('Title 按级别渲染标题标签', () => {
    render(<Title level={3}>章节标题</Title>)
    expect(screen.getByRole('heading', { level: 3, name: '章节标题' })).not.toBeNull()
  })

  it('Text code 变体渲染 code 元素', () => {
    render(<Text code>pnpm dev</Text>)
    expect(screen.getByText('pnpm dev').tagName).toBe('CODE')
  })

  it('Kbd 渲染键盘按键', () => {
    render(<Kbd>⌘K</Kbd>)
    expect(screen.getByText('⌘K').tagName).toBe('KBD')
  })

  it('Card 渲染标题、内容与页脚', () => {
    render(<Card title="项目卡片" footer="更新于 10.12">卡片正文</Card>)
    expect(screen.getByText('项目卡片')).not.toBeNull()
    expect(screen.getByText('卡片正文')).not.toBeNull()
    expect(screen.getByText('更新于 10.12')).not.toBeNull()
  })
})

describe('v1.3.0 选择控件', () => {
  it('Segmented 切换选中项', () => {
    const onChange = vi.fn()
    render(<Segmented options={['网格', '列表']} value="网格" onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: '列表' }))
    expect(onChange).toHaveBeenCalledWith('列表')
  })

  it('RadioGroup 切换值', () => {
    const onChange = vi.fn()
    render(<RadioGroup options={['公开', '仅自己']} value="公开" onChange={onChange} />)
    fireEvent.click(screen.getByLabelText('仅自己'))
    expect(onChange).toHaveBeenCalledWith('仅自己')
  })

  it('Toggle 切换按压态', () => {
    const onChange = vi.fn()
    render(<Toggle pressed={false} onChange={onChange}>加粗</Toggle>)
    fireEvent.click(screen.getByRole('button', { name: '加粗' }))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('Rate 选择星级', () => {
    const onChange = vi.fn()
    render(<Rate value={2} onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: '4 星' }))
    expect(onChange).toHaveBeenCalledWith(4)
  })
})

describe('v1.3.0 浮层与加载', () => {
  it('Popover 点击打开、Escape 关闭', () => {
    render(<Popover trigger="查看详情" content="面板内容" ariaLabel="详情面板" />)
    fireEvent.click(screen.getByRole('button', { name: '查看详情' }))
    expect(screen.getByRole('dialog', { name: '详情面板' })).not.toBeNull()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('HoverCard 渲染提示内容', () => {
    render(<HoverCard content="悬停提示">目标文本</HoverCard>)
    expect(screen.getByRole('tooltip').textContent).toBe('悬停提示')
  })

  it('Spin 有 status 角色', () => {
    render(<Spin label="加载中" />)
    expect(screen.getByRole('status', { name: '加载中' })).not.toBeNull()
  })
})

describe('v1.3.0 表单抽象', () => {
  it('useForm 校验失败显示错误，通过后提交', () => {
    const onSubmit = vi.fn()
    function Harness() {
      const { values, errors, setField, handleSubmit } = useForm({
        initialValues: { email: '' },
        rules: { email: { required: true, pattern: /@/, message: '需要有效邮箱。' } },
        onSubmit,
      })
      return <form onSubmit={handleSubmit}>
        <FormItem label="邮箱" error={errors.email} htmlFor="email">
          <input id="email" value={values.email} onChange={event => setField('email', event.target.value)} />
        </FormItem>
        <button type="submit">提交</button>
      </form>
    }
    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: '提交' }))
    expect(screen.getByRole('alert').textContent).toContain('需要有效邮箱')
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'sky@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: '提交' }))
    expect(screen.queryByRole('alert')).toBeNull()
    expect(onSubmit).toHaveBeenCalledWith({ email: 'sky@example.com' })
  })
})

describe('v1.3.0 命令面板', () => {
  it('Command 过滤并回车选择', () => {
    const onSelect = vi.fn()
    render(<Command open onClose={() => {}} items={[{ id: 'gallery', label: '打开画廊' }, { id: 'theme', label: '切换主题', onSelect }]} />)
    const input = screen.getByPlaceholderText('搜索命令…')
    fireEvent.change(input, { target: { value: '主题' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalled()
  })
})

describe('v1.3.0 日期', () => {
  it('Calendar 切换月份并选择日期', () => {
    const onChange = vi.fn()
    render(<Calendar onChange={onChange} />)
    const now = new Date()
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    expect(screen.getByText(`${now.getFullYear()} 年 ${now.getMonth() + 1} 月`)).not.toBeNull()
    fireEvent.click(screen.getByLabelText('下一个月'))
    expect(screen.getByText(`${next.getFullYear()} 年 ${next.getMonth() + 1} 月`)).not.toBeNull()
    fireEvent.click(screen.getByLabelText(`${next.getFullYear()} 年 ${next.getMonth() + 1} 月 15 日`))
    expect(onChange).toHaveBeenCalled()
  })

  it('DatePicker 打开后显示日历', () => {
    render(<DatePicker placeholder="选择日期" />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('grid', { name: '日期选择' })).not.toBeNull()
  })
})

describe('v1.3.0 展示与布局', () => {
  it('Carousel 切换到下一张', () => {
    render(<Carousel items={['第一张', '第二张']} />)
    expect((screen.getByText('第二张') as HTMLElement).hidden).toBe(true)
    fireEvent.click(screen.getByLabelText('下一张'))
    expect((screen.getByText('第二张') as HTMLElement).hidden).toBe(false)
    expect((screen.getByText('第一张') as HTMLElement).hidden).toBe(true)
  })

  it('GridItem 跨度按父级列数裁剪', () => {
    const { container } = render(<Grid cols={6}><GridItem span={12}>内容</GridItem></Grid>)
    const item = container.querySelector('.skyui-grid-item') as HTMLElement
    expect(item.style.gridColumn).toBe('span 6')
  })

  it('ConfigProvider 注入主题类与默认按钮尺寸', () => {
    const { container } = render(<ConfigProvider theme="dark" size="sm"><Button>按钮</Button></ConfigProvider>)
    expect(container.firstElementChild?.className).toContain('skyui-theme-dark')
    expect(screen.getByRole('button', { name: '按钮' }).className).toContain('skyui-button-sm')
  })

  it('Table 加载态渲染骨架行', () => {
    const { container } = render(<Table columns={[{ key: 'name', header: '名称' }]} rows={[]} loading />)
    expect(container.querySelectorAll('.skyui-skeleton').length).toBeGreaterThan(0)
  })
})
