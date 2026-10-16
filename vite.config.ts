import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

// 目标平台通过 DEPLOY_TARGET 切换，避免 Cloudflare 插件污染 Vercel / Netlify 的构建
const deployTarget = process.env.DEPLOY_TARGET ?? 'default'

// GitHub Pages 是纯静态托管，项目页位于 /imskyui/ 子路径：
// 注入 base 使资源指向子路径，并开启预渲染把唯一路由固化成静态 HTML
const isPages = deployTarget === 'github-pages'

const config = defineConfig({
  ...(isPages ? { base: '/imskyui/' } : {}),
  plugins: [
    // 必须早于 tanstackStart()，让 Workers 运行时接管 ssr 环境
    ...(deployTarget === 'cloudflare'
      ? [
          (await import('@cloudflare/vite-plugin')).cloudflare({
            viteEnvironment: { name: 'ssr' },
          }),
        ]
      : []),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      // Pages 没有 Node 服务端：预渲染唯一路由，静态产物全部落在 dist/client
      ...(isPages ? { prerender: { enabled: true } } : {}),
    }),
    viteReact(),
  ],
})

export default config
