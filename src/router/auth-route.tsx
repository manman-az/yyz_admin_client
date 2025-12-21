import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

/**
 * 基础鉴权路由：
 * - 未登录：跳转 /login
 * - 已登录：透传子路由
 * 后续接入 RBAC 时，可在这里做 roles / perms 校验与重定向
 */
export function AuthRoute() {
  const isAuthed = useAuthStore((s) => s.isAuthed())
  const location = useLocation()

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}


