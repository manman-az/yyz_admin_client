import type { PermCode } from '@/types/auth'

export function hasPerm(owned: PermCode[], perm?: PermCode) {
  if (!perm) return true
  return owned.includes(perm)
}

export function hasAnyPerm(owned: PermCode[], perms?: PermCode[]) {
  if (!perms || perms.length === 0) return true
  const set = new Set(owned)
  return perms.some((p) => set.has(p))
}


