import React from 'react'
import type { PermCode } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'

export function useCan(perm?: PermCode) {
  return useAuthStore((s) => s.hasPerm(perm))
}

export function Can(props: { perm: PermCode; children: React.ReactNode; fallback?: React.ReactNode }) {
  const ok = useCan(props.perm)
  if (ok) return <>{props.children}</>
  return <>{props.fallback ?? null}</>
}


