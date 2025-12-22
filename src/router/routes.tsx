import { Suspense, lazy } from 'react'
import type { ReactNode } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { AuthRoute } from './auth-route'
import { Spin } from 'antd'

// 路由懒加载（按需拆包）
const AdminLayout = lazy(() => import('@/layouts/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const LoginPage = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })))
const DashboardPage = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const ForbiddenPage = lazy(() => import('@/pages/Forbidden').then((m) => ({ default: m.Forbidden })))
const NotFoundPage = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })))

function withSuspense(element: ReactNode) {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin />
        </div>
      }
    >
      {element}
    </Suspense>
  )
}

/**
 * 配置式路由
 * - index 重定向：/ -> /dashboard
 * - 兜底 404：path="*"
 */
export const routesConfig: RouteObject[] = [
  { path: '/login', element: withSuspense(<LoginPage />) },
  { path: '/403', element: withSuspense(<ForbiddenPage />) },
  {
    element: <AuthRoute />,
    children: [
      {
        element: withSuspense(<AdminLayout />),
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: withSuspense(<DashboardPage />) },
      // ... 你的后台页面路由放这里（或后续动态注入）
          { path: '*', element: withSuspense(<NotFoundPage />) },
        ],
      },
    ],
  },
  { path: '*', element: withSuspense(<NotFoundPage />) },
]

const router = createBrowserRouter(routesConfig)

export function AppRouter() {
  return <RouterProvider router={router} />
}