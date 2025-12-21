export type RoleCode = string
export type PermCode = string

export type UserInfo = {
  id: string
  username: string
  nickname?: string
  roles: RoleCode[]
  perms: PermCode[]
}


