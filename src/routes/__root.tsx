import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button, HttpStatusPage } from '../components/ui'


import '../styles.css'

const siteName = 'skyui — 我的黑白设计系统'
const siteDescription = 'skyui 是你的黑白 UI 组件库，提供基础组件、完整表单、HTTP 与错误页面、数据表格和状态反馈，以及可下载的 React 源码。'

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: 'icon', type: 'image/svg+xml', href: '/skyui.svg' }],
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
  errorComponent: RouteErrorPage,
})

function NotFoundPage() {
  return <main className="route-status"><Link to="/" className="route-status-brand">skyui</Link><HttpStatusPage code={404} title="这一页，留白了" description="这个地址没有对应的页面。回到 skyui，继续寻找你的下一个组件。" actions={<Link to="/" className="skyui-button skyui-button-primary">返回组件库 →</Link>} /></main>
}

function RouteErrorPage({ reset }: ErrorComponentProps) {
  return <main className="route-status"><Link to="/" className="route-status-brand">skyui</Link><HttpStatusPage code={500} title="页面暂时遇到了一点问题" description="页面渲染失败。重新尝试，或返回组件库；这里不会公开内部错误详情。" actions={<><Button onClick={reset}>重新尝试</Button><Link to="/" className="skyui-button skyui-button-secondary">返回组件库</Link></>} /></main>
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
