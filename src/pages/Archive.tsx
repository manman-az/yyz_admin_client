import { Link, useLoaderData } from 'react-router-dom'

import { Container } from '@/components/Container'
import { useI18n } from '@/i18n/context'
import type { ArchiveLoaderData } from '@/router/loaders'
import { formatDate } from '@/utils/blog'

export function ArchivePage() {
  const { locale, t } = useI18n()
  const { groups } = useLoaderData() as ArchiveLoaderData

  return (
    <Container>
      <section className="page-header">
        <div>
          <h1 className="page-title">{t('archive.title')}</h1>
          <div className="page-subtitle muted">{t('archive.subtitle')}</div>
        </div>
      </section>

      <div className="archive">
        {groups.map((g) => (
          <section key={g.year} className="archive-year">
            <h2 className="archive-year-title">{g.year}</h2>
            <div className="archive-list">
              {g.posts.map((p) => (
                <Link key={p.id} className="archive-item" to={`/post/${p.slug}`}>
                  <span className="archive-item-title">{p.title}</span>
                  <span className="muted">{formatDate(p.publishedAt, locale)}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  )
}
