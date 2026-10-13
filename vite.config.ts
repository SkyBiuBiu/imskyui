import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

// 目标平台通过 DEPLOY_TARGET 切换，避免 Cloudflare 插件污染 Vercel / Netlify 的构建
const deployTarget = process.env.DEPLOY_TARGET ?? 'default'

const config = defineConfig({
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
    tanstackStart(),
    viteReact(),
  ],
})

export default config
