import { Link } from 'react-router-dom'

import { cn } from '@/utils/cn'

type Props = {
  to: string
  label: string
  className?: string
}

export function TagChip({ to, label, className }: Props) {
  return (
    <Link className={cn('chip', className)} to={to}>
      {label}
    </Link>
  )
}

