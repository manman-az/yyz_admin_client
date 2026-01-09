import { Link, useLoaderData } from 'react-router-dom'

import { Container } from '@/components/Container'
import { useI18n } from '@/i18n/context'
import type { TagsLoaderData } from '@/router/loaders'

export function TagsPage() {
  const { t } = useI18n()
  const { tags } = useLoaderData() as TagsLoaderData

  return (
    <Container>
      <section className="page-header">
        <div>
          <h1 className="page-title">{t('tags.title')}</h1>
          <div className="page-subtitle muted">{t('tags.subtitle')}</div>
        </div>
      </section>

      <div className="grid-cards">
        {tags.map((tag) => (
          <Link key={tag.name} className="card facet-card" to={`/tag/${encodeURIComponent(tag.name)}`}>
            <div className="facet-card-title">#{tag.name}</div>
            <div className="muted">{t('tags.postsCount', { count: tag.count })}</div>
          </Link>
        ))}
      </div>
    </Container>
  )
}
