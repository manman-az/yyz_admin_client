import { Link } from 'react-router-dom'

import { useI18n } from '@/i18n/context'
import { cn } from '@/utils/cn'

type Props = {
  page: number
  pageSize: number
  total: number
  hrefForPage: (page: number) => string
  className?: string
}

export function Pagination({ page, pageSize, total, hrefForPage, className }: Props) {
  const { t } = useI18n()
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  if (pageCount <= 1) return null

  const start = Math.max(1, page - 2)
  const end = Math.min(pageCount, start + 4)
  const pages = Array.from({ length: end - start + 1 }, (_, idx) => start + idx)

  return (
    <nav className={cn('pagination', className)} aria-label={t('pagination.aria')}>
      <Link className={cn('page-link', page <= 1 && 'disabled')} to={hrefForPage(Math.max(1, page - 1))}>
        {t('pagination.prev')}
      </Link>
      {pages.map((p) => (
        <Link key={p} className={cn('page-link', p === page && 'active')} to={hrefForPage(p)}>
          {p}
        </Link>
      ))}
      <Link
        className={cn('page-link', page >= pageCount && 'disabled')}
        to={hrefForPage(Math.min(pageCount, page + 1))}
      >
        {t('pagination.next')}
      </Link>
    </nav>
  )
}
