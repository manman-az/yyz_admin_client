import axios from 'axios'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'

export const request = axios.create({
  // 推荐配置：VITE_API_BASE_URL=http://127.0.0.1:8000/api
  // 未配置时，默认走同域 /api（例如前端 devServer 反代到后端）
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
})

export type ApiError = {
  status?: number
  code?: string
  message: string
  details?: unknown
  raw?: unknown
}

export function isApiError(e: unknown): e is ApiError {
  return Boolean(e && typeof e === 'object' && 'message' in e)
}

function toApiError(err: unknown): ApiError {
  if (!axios.isAxiosError(err)) {
    const msg = err instanceof Error ? err.message : String(err)
    return { message: msg || 'unknown_error', raw: err }
  }

  const ax = err as AxiosError<any>
  const status = ax.response?.status
  const data = ax.response?.data

  // 后端常见结构：{ message: 'xxx' } 或 { errors: ... }
  const message =
    (typeof data === 'object' && data && typeof data.message === 'string' && data.message) ||
    ax.message ||
    'request_failed'

  const details =
    (typeof data === 'object' && data && (data.errors ?? data)) || data || ax.toJSON?.() || undefined

  return {
    status,
    code: (typeof data === 'object' && data && typeof data.code === 'string' && data.code) || undefined,
    message,
    details,
    raw: ax,
  }
}

request.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  config.headers = config.headers ?? {}
  config.headers.Accept = config.headers.Accept ?? 'application/json'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (res) => {
    const payload = res.data as any

    // 统一解包：{ ok: true, data: ... } / { ok: false, code, message, ... }
    if (payload && typeof payload === 'object' && typeof payload.ok === 'boolean') {
      if (payload.ok === true) {
        return payload.data ?? payload
      }

      const err: ApiError = {
        status: res.status,
        code: typeof payload.code === 'string' ? payload.code : 'request_failed',
        message: typeof payload.message === 'string' ? payload.message : 'request_failed',
        details: payload.errors ?? payload,
        raw: payload,
      }
      return Promise.reject(err)
    }

    return payload
  },
  (err: AxiosError) => {
    const status = err.response?.status
    const url = err.config?.url ?? ''
    const isLoginReq = url.includes('/auth/login')

    // 401：清理本地登录态并跳回登录页（但登录接口本身返回 401 时不做重定向，避免闪屏/刷新）
    if (status === 401 && !isLoginReq) {
      useAuthStore.getState().logout()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(toApiError(err))
  }
)

export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) => request.get<T, T>(url, config),
  post: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) => request.post<T, T, D>(url, data, config),
  put: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) => request.put<T, T, D>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => request.delete<T, T>(url, config),
}


