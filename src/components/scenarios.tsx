import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Badge, Breadcrumb, Button, Checkbox, EmptyState, HttpStatusPage, Input, Pagination, RadioGroup, Select, Skeleton, Steps, Switch, Table, Textarea } from './ui'
import './scenarios.css'

export const httpScenarios = [
  { code: 200, name: 'OK', title: '一切就绪', description: '请求成功，内容已准备好。继续浏览你的工作空间。', action: '继续浏览', result: '已进入内容展示状态。' },
  { code: 201, name: 'Created', title: '新的作品，已创建', description: '资源创建成功。给每一次新的开始，一个清晰的确认。', action: '查看作品', result: '这里可以展示刚创建的资源。' },
  { code: 202, name: 'Accepted', title: '任务已加入队列', description: '请求已接受，处理尚未完成。你可以稍后查看任务进度。', action: '查看进度', result: '任务进度：68%（示例，不是真实后台任务）。' },
  { code: 204, name: 'No Content', title: '操作完成，无需更多', description: '响应不包含正文。这是客户端在操作完成后展示的确认界面。', action: '返回列表', result: '已返回列表展示状态。' },
  { code: 301, name: 'Moved Permanently', title: '内容有了新地址', description: '资源已永久迁移。为用户保留清晰的下一站。', action: '前往新地址', result: '此处可接入新地址；演示不会跳转外部网站。' },
  { code: 400, name: 'Bad Request', title: '请求需要调整一下', description: '服务器无法处理当前请求。检查提交内容后再试一次。', action: '修改请求', result: '此处可返回原表单并保留用户已填写的内容。' },
  { code: 401, name: 'Unauthorized', title: '先确认一下你的身份', description: '需要有效的身份凭证才能继续。登录后，再回到这里。', action: '前往登录', result: '登录入口示例。当前组件库没有账户或真实认证。' },
  { code: 403, name: 'Forbidden', title: '这扇门，暂时没有权限', description: '服务器拒绝访问这个资源。如有需要，请联系管理员。', action: '查看权限说明', result: '此处可展示所需权限及管理员联系方式。' },
  { code: 404, name: 'Not Found', title: '这一页，留白了', description: '我们没有找到这个页面。也许地址有误，也许它已经搬家。', action: '返回首页', result: '首页入口示例。此处可接入应用的真实首页导航。' },
  { code: 408, name: 'Request Timeout', title: '这次请求，等得有点久', description: '服务器未及时收到完整请求。检查网络连接后重新尝试。', action: '重新尝试', result: '重试完成，内容已恢复（本地演示）。' },
  { code: 409, name: 'Conflict', title: '内容发生了冲突', description: '请求与资源当前状态冲突。查看最新版本，再决定如何修改。', action: '查看最新版本', result: '最新版本：v1.3。此处可接入版本比较和冲突解决界面。' },
  { code: 410, name: 'Gone', title: '这段内容，已告别', description: '资源已被永久移除。回到列表，发现其他值得留下的内容。', action: '浏览其他内容', result: '此处可展示替代资源或返回内容列表。' },
  { code: 422, name: 'Unprocessable Content', title: '还有一些内容需要完善', description: '请求内容无法按当前规则处理。根据字段提示修改后再提交。', action: '查看字段提示', result: '字段提示示例：项目名称不能为空，说明至少需要 10 个字符。' },
  { code: 429, name: 'Too Many Requests', title: '慢一点，也很好', description: '请求过于频繁。等待片刻再试，让服务有时间响应。', action: '重新尝试', result: '重试成功（本地演示）。实际等待时间应以服务器提示为准。' },
  { code: 500, name: 'Internal Server Error', title: '出了点意料之外的问题', description: '服务器遇到异常。你的操作没有被忽略，请稍后再试。', action: '重试请求', result: '内容已恢复（本地演示，不会发送网络请求）。' },
  { code: 502, name: 'Bad Gateway', title: '连接的另一端，暂时失联', description: '网关收到无效的上游响应。稍等片刻，重新连接。', action: '重新连接', result: '连接已恢复（本地演示）。' },
  { code: 503, name: 'Service Unavailable', title: '正在维护，稍后见', description: '服务暂时不可用。一次短暂的暂停，为下一次更好的相遇。', action: '检查服务状态', result: '维护已结束（本地演示，不代表真实服务状态）。' },
  { code: 504, name: 'Gateway Timeout', title: '上游响应，迟到了一点', description: '网关未及时收到上游响应。无需重复提交，稍后再试。', action: '重新检查', result: '上游响应已恢复（本地演示）。' },
] as const

type HttpScenario = (typeof httpScenarios)[number]

export function HttpDemo({ scenario }: { scenario: HttpScenario }) {
  const [resolved, setResolved] = useState(false)
  const [seconds, setSeconds] = useState(scenario.code === 429 ? 5 : 0)
  useEffect(() => {
    if (seconds === 0) return
    const timer = window.setTimeout(() => setSeconds(value => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [seconds])
  return <div className="skyui-scenario skyui-http-demo">
    {resolved ? <div className="skyui-http-result"><Alert title="交互预览" variant="success">{scenario.result}</Alert><Button variant="secondary" onClick={() => { setResolved(false); setSeconds(scenario.code === 429 ? 5 : 0) }}>返回状态页面</Button></div> : <HttpStatusPage code={scenario.code} title={scenario.title} description={scenario.description} actions={<Button disabled={seconds > 0} onClick={() => setResolved(true)}>{seconds > 0 ? `${seconds} 秒后重试` : scenario.action}</Button>} />}
    <small className="skyui-demo-note">界面示例 · 不改变当前 HTTP 响应状态</small>
  </div>
}

type ContactErrors = { name?: string; email?: string; message?: string; consent?: string }

export function ContactFormDemo() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const consentId = useId()
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: ContactErrors = {}
    if (!name.trim()) nextErrors.name = '请填写你的称呼。'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = '请填写有效的邮箱地址。'
    if (message.trim().length < 10) nextErrors.message = '请至少填写 10 个字符。'
    if (!consent) nextErrors.consent = '请先确认这是本地演示。'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) setSubmitted(true)
    else requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
  }
  if (submitted) return <div className="skyui-scenario"><EmptyState title="填写完成" description="校验已通过。内容没有发送或保存到服务器。" action={<Button variant="secondary" onClick={() => { setSubmitted(false); setErrors({}) }}>继续编辑</Button>} /></div>
  return <form ref={formRef} className="skyui-scenario skyui-demo-form" noValidate onSubmit={submit}>
    <Input label="你的称呼" autoComplete="off" value={name} onChange={event => setName(event.target.value)} invalid={Boolean(errors.name)} error={errors.name} required />
    <Input label="邮箱地址" type="email" autoComplete="off" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} invalid={Boolean(errors.email)} error={errors.email} required />
    <Textarea label="想聊些什么" placeholder="写下你的想法，至少 10 个字符" value={message} onChange={event => setMessage(event.target.value)} error={errors.message} required />
    <Checkbox label="我了解内容仅用于本地演示" checked={consent} onChange={event => setConsent(event.target.checked)} aria-invalid={Boolean(errors.consent) || undefined} aria-describedby={errors.consent ? `${consentId}-consent-error` : undefined} />
    {errors.consent && <small id={`${consentId}-consent-error`} className="skyui-field-error">{errors.consent}</small>}
    <Button type="submit">校验并预览</Button>
    <small className="skyui-demo-note">不会发送邮件或保存个人信息</small>
  </form>
}

export function MultiStepFormDemo() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [direction, setDirection] = useState('个人网站')
  const [error, setError] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const previousStep = useRef(step)
  useEffect(() => {
    if (step === previousStep.current) return
    previousStep.current = step
    formRef.current?.querySelector<HTMLElement>('input, select, button')?.focus({ preventScroll: true })
  }, [step])
  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step === 1 && !name.trim()) { setError(true); formRef.current?.querySelector('input')?.focus(); return }
    setError(false)
    setStep(value => value + 1)
  }
  return <form ref={formRef} className="skyui-scenario skyui-demo-form" onSubmit={next} noValidate>
    <Steps items={['基本信息', '确认内容', '完成']} current={step} ariaLabel="创建项目步骤" />
    {step === 1 ? <><Input label="项目名称" placeholder="例如：留白工作室" value={name} onChange={event => setName(event.target.value)} invalid={error} error="先给项目起个名字。" required /><Select label="项目方向" value={direction} onChange={event => setDirection(event.target.value)}><option>个人网站</option><option>组件库</option><option>作品集</option></Select><Button type="submit">下一步 →</Button></> : step === 2 ? <><div className="skyui-review"><span>项目名称<strong>{name}</strong></span><span>项目方向<strong>{direction}</strong></span></div><div className="skyui-action-row"><Button variant="secondary" onClick={() => setStep(1)}>上一步</Button><Button type="submit">确认预览</Button></div></> : <><Alert title="项目预览已完成" variant="success">{name} · {direction}。没有创建真实项目。</Alert><Button variant="secondary" onClick={() => { setStep(1); setName('') }}>再试一次</Button></>}
    <small className="skyui-demo-note">多步骤校验 · 返回时保留输入</small>
  </form>
}

export function SettingsFormDemo() {
  const [notifications, setNotifications] = useState(true)
  const [digest, setDigest] = useState('每周摘要')
  const [visibility, setVisibility] = useState('公开')
  const [saved, setSaved] = useState(false)
  function reset() { setNotifications(true); setDigest('每周摘要'); setVisibility('公开'); setSaved(false) }
  return <form className="skyui-scenario skyui-demo-form" onSubmit={event => { event.preventDefault(); setSaved(true) }} onChange={() => setSaved(false)}>
    <div className="skyui-setting-row"><div><strong>接收更新通知</strong><small>让重要的变化被看见</small></div><Switch label="接收更新通知" checked={notifications} onChange={value => { setNotifications(value); setSaved(false) }} /></div>
    <Select label="通知频率" value={digest} disabled={!notifications} onChange={event => setDigest(event.target.value)}><option>每周摘要</option><option>每日摘要</option><option>仅重要更新</option></Select>
    <div className="skyui-setting-block"><strong>作品可见性</strong><RadioGroup ariaLabel="作品可见性" options={['公开', '仅自己']} value={visibility} onChange={setVisibility} /></div>
    <div className="skyui-action-row"><Button type="submit">应用设置</Button><Button variant="secondary" onClick={reset}>重置</Button></div>
    {saved && <Alert title="已应用到当前预览" variant="success">刷新页面后恢复默认，不会写入账户。</Alert>}
    <small className="skyui-demo-note">设置仅存在于当前组件会话</small>
  </form>
}

export function UploadFieldDemo() {
  const [file, setFile] = useState<{ name: string; size: number } | null>(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  function choose(selectedFile?: File) {
    if (!selectedFile) return
    const validType = ['image/png', 'image/jpeg', 'application/pdf'].includes(selectedFile.type)
    if (!validType || selectedFile.size > 5 * 1024 * 1024) { setError('请选择 5 MB 以内的 PNG、JPG 或 PDF 文件。'); return }
    setError('')
    setFile({ name: selectedFile.name, size: selectedFile.size })
  }
  return <div className="skyui-scenario skyui-demo-form">
    <div className={`skyui-dropzone ${dragging ? 'is-dragging' : ''}`} onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); choose(event.dataTransfer.files[0]) }}>
      <span className="skyui-upload-symbol" aria-hidden="true">↑</span><strong>为想法添加一份附件</strong><p>拖放文件，或使用按钮选择</p><Button variant="secondary" onClick={() => inputRef.current?.click()}>选择文件</Button><small>PNG / JPG / PDF · 最大 5 MB</small>
      <input ref={inputRef} type="file" hidden accept="image/png,image/jpeg,application/pdf" aria-label="选择演示附件" onChange={event => { choose(event.target.files?.[0]); event.target.value = '' }} />
    </div>
    {error && <Alert title="文件无法使用" variant="error">{error}</Alert>}
    {file && <div className="skyui-file-row" role="status"><span><strong>{file.name}</strong><small>{(file.size / 1024).toFixed(1)} KB · 已选择</small></span><Button variant="ghost" aria-label={`移除 ${file.name}`} onClick={() => { setFile(null); setError('') }}>移除</Button></div>}
    <small className="skyui-demo-note">仅校验文件信息，不读取内容、不上传</small>
  </div>
}

export function DataStatesDemo() {
  const [state, setState] = useState('加载中')
  return <div className="skyui-scenario skyui-demo-form">
    <div className="skyui-state-controls" role="group" aria-label="数据状态预览">{['加载中', '空状态', '失败', '成功'].map(option => <button type="button" key={option} aria-pressed={state === option} onClick={() => setState(option)}>{option}</button>)}</div>
    <div className="skyui-state-preview">
      {state === '加载中' && <div className="skyui-loading-preview" role="status" aria-label="正在加载内容"><Skeleton className="skyui-skeleton-avatar" /><div><Skeleton /><Skeleton style={{ width: '72%' }} /><Skeleton style={{ width: '44%' }} /></div><span className="skyui-demo-note">正在加载内容…</span></div>}
      {state === '空状态' && <EmptyState title="第一件作品，还在路上" description="创建一个项目，让这个空间开始有你的痕迹。" action={<Button variant="secondary" onClick={() => setState('成功')}>创建示例</Button>} />}
      {state === '失败' && <><Alert title="内容加载失败" variant="error">暂时无法获取内容。已填写的信息不会丢失。</Alert><Button variant="secondary" onClick={() => setState('成功')}>重试加载</Button></>}
      {state === '成功' && <><Alert title="内容已准备好" variant="success">留白工作室 · 第一件作品</Alert><div className="skyui-state-item"><span>作品集 / Portfolio</span><Badge variant="outline">已发布</Badge></div></>}
    </div>
    <small className="skyui-demo-note">手动切换状态 · 不发送网络请求</small>
  </div>
}

const demoProjects = [
  { name: '留白工作室', type: '作品集', status: '已发布', date: '10.12' },
  { name: '山间笔记', type: '个人网站', status: '草稿', date: '10.09' },
  { name: '纸上散步', type: '组件库', status: '进行中', date: '10.07' },
  { name: '黑白之间', type: '作品集', status: '已发布', date: '10.04' },
  { name: '慢设计档案', type: '个人网站', status: '草稿', date: '10.02' },
  { name: '边界练习', type: '组件库', status: '进行中', date: '09.28' },
]

export function DataTableDemo() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [ascending, setAscending] = useState(false)
  const projects = demoProjects.filter(project => `${project.name} ${project.type} ${project.status}`.includes(query.trim())).sort((first, second) => ascending ? first.date.localeCompare(second.date) : second.date.localeCompare(first.date))
  const pages = Math.max(1, Math.ceil(projects.length / 3))
  return <div className="skyui-scenario skyui-demo-form">
    <Input label="筛选项目" placeholder="搜索名称、类型或状态" value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} />
    <Table caption="我的项目 · 全部为示例数据" rowKey={project => project.name} rows={projects.slice((page - 1) * 3, page * 3)} columns={[{ key: 'name', header: '项目', render: project => <span><strong>{project.name}</strong><small>{project.type}</small></span> }, { key: 'status', header: '状态', render: project => <Badge variant={project.status === '已发布' ? 'dark' : 'outline'}>{project.status}</Badge> }, { key: 'date', header: <button type="button" onClick={() => setAscending(value => !value)} aria-sort={ascending ? 'ascending' : 'descending'}>更新 {ascending ? '↑' : '↓'}</button> }]} />
    {projects.length === 0 && <EmptyState title="没有匹配的项目" description="换一个关键词，或清除筛选条件。" action={<Button variant="secondary" onClick={() => setQuery('')}>清除筛选</Button>} />}
    <Pagination ariaLabel="项目分页" page={page} pageCount={pages} onChange={setPage} />
    <small className="skyui-demo-note">{projects.length} 项 · 第 {page} / {pages} 页</small>
  </div>
}

export function NavigationDemo() {
  const [level, setLevel] = useState(2)
  const [page, setPage] = useState(1)
  const levels = ['工作空间', '我的作品', '留白工作室']
  return <div className="skyui-scenario skyui-demo-form">
    <Breadcrumb ariaLabel="示例面包屑" items={levels.slice(0, level + 1).map((label, index) => ({ label, onClick: () => { setLevel(index); setPage(1) } }))} />
    <div className="skyui-navigation-preview"><span className="skyui-demo-note">当前位置</span><h4>{levels[level]}</h4><p>内容预览 · 第 {page} 页</p>{level < 2 && <Button variant="secondary" onClick={() => { setLevel(value => value + 1); setPage(1) }}>进入{levels[level + 1]} →</Button>}</div>
    <Pagination ariaLabel="示例分页" page={page} pageCount={4} onChange={setPage} />
    <small className="skyui-demo-note">导航交互示例 · 不改变站点路由</small>
  </div>
}
