import type { UserInfo } from '@/types/auth'
import { http } from './request'

export type LoginPayload = {
  username: string
  password: string
}

export type LoginResponse = {
  token: string
  user: UserInfo
}

export const authApi = {
  login: (payload: LoginPayload) => http.post<LoginResponse, LoginPayload>('/auth/login', payload),
  me: () => http.get<UserInfo>('/auth/me'),
  logout: () => http.post<{ ok: boolean }, void>('/auth/logout'),
}


