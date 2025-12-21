import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { AuthRoute } from './auth-route'
import { AdminLayout } from '@/layouts/AdminLayout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Forbidden } from '@/pages/Forbidden'
import { NotFound } from '@/pages/NotFound'

/**
 * 配置式路由
 * - index 重定向：/ -> /dashboard
 * - 兜底 404：path="*"
 */
export const routesConfig: RouteObject[] = [
  { path: '/login', element: <Login /> },
  { path: '/403', element: <Forbidden /> },
  {
    element: <AuthRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <Dashboard /> },
      // ... 你的后台页面路由放这里（或后续动态注入）
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]

const router = createBrowserRouter(routesConfig)

export function AppRouter() {
  return <RouterProvider router={router} />
}