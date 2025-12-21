import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PermCode, RoleCode, UserInfo } from '@/types/auth'
import { authApi } from '@/services/auth'

type AuthState = {
  token: string | null
  user: UserInfo | null
  roles: RoleCode[]
  perms: PermCode[]

  isAuthed: () => boolean
  hasPerm: (perm?: PermCode) => boolean
  hasAnyPerm: (perms?: PermCode[]) => boolean

  login: (payload: { username: string; password: string }) => Promise<void>
  // 可选：用于刷新 token 仍在时的用户信息（例如页面刷新后）
  fetchMe: () => Promise<void>
  // 可选：通知后端注销（失败也会清理本地态）
  logoutRemote: () => Promise<void>

  // 兼容：保留 mock，避免开发阶段其它地方引用报错（登录页已改成真实 login）
  loginMock: (payload: { username: string; password: string }) => Promise<void>
  logout: () => void
  setUser: (user: UserInfo | null) => void
  setToken: (token: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      roles: [],
      perms: [],

      isAuthed: () => Boolean(get().token),
      hasPerm: (perm) => {
        if (!perm) return true
        return get().perms.includes(perm)
      },
      hasAnyPerm: (perms) => {
        if (!perms || perms.length === 0) return true
        const setPerms = new Set(get().perms)
        return perms.some((p) => setPerms.has(p))
      },

      login: async ({ username, password }) => {
        const { token, user } = await authApi.login({ username, password })
        set({
          token,
          user,
          roles: user.roles,
          perms: user.perms,
        })
      },
      fetchMe: async () => {
        const token = get().token
        if (!token) return
        const user = await authApi.me()
        set({ user, roles: user.roles, perms: user.perms })
      },
      logoutRemote: async () => {
        try {
          // 可能会因为 token 过期返回 401，这时 request.ts 会自动清理；这里兜底再清一次
          await authApi.logout()
        } finally {
          set({ token: null, user: null, roles: [], perms: [] })
        }
      },

      loginMock: async ({ username, password }) => {
        // 演示：admin 拥有全部权限，其他用户权限较少
        if (!username || !password) throw new Error('invalid_credentials')

        const isAdmin = username === 'admin'
        const token = `mock_${Date.now()}`

        const perms: PermCode[] = isAdmin
          ? ['dashboard:view', 'charts:view', 'dnd:view', 'canvas:view', 'user:list', 'user:create', 'user:delete']
          : ['dashboard:view', 'charts:view', 'user:list']

        const user: UserInfo = {
          id: '1',
          username,
          nickname: isAdmin ? '管理员' : '普通用户',
          roles: isAdmin ? ['admin'] : ['viewer'],
          perms,
        }

        set({
          token,
          user,
          roles: user.roles,
          perms: user.perms,
        })
      },
      logout: () => {
        set({ token: null, user: null, roles: [], perms: [] })
      },
      setUser: (user) => {
        set({ user, roles: user?.roles ?? [], perms: user?.perms ?? [] })
      },
      setToken: (token) => set({ token }),
    }),
    {
      name: 'yyz_admin_auth',
      partialize: (s) => ({ token: s.token, user: s.user, roles: s.roles, perms: s.perms }),
    }
  )
)


