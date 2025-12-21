import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 可通过环境变量覆盖后端地址：
  // VITE_PROXY_TARGET=http://127.0.0.1:8000
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://127.0.0.1:8000'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // Windows 上有些环境会只监听到 [::1]，导致 localhost/127.0.0.1 访问失败
      // 绑定到 IPv4/所有网卡，方便本机和局域网访问
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      proxy: {
        // 让前端请求 /api/* 自动转发到后端，避免 404 + CORS
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
