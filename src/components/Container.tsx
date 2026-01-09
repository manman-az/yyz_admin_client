import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

type Props = {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: Props) {
  return <div className={cn('container', className)}>{children}</div>
}

