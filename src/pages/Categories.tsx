import { Link, useLoaderData } from 'react-router-dom'

import { Container } from '@/components/Container'
import { useI18n } from '@/i18n/context'
import type { CategoriesLoaderData } from '@/router/loaders'

export function CategoriesPage() {
  const { t } = useI18n()
  const { categories } = useLoaderData() as CategoriesLoaderData

  return (
    <Container>
      <section className="page-header">
        <div>
          <h1 className="page-title">{t('categories.title')}</h1>
          <div className="page-subtitle muted">{t('categories.subtitle')}</div>
        </div>
      </section>

      <div className="grid-cards">
        {categories.map((c) => (
          <Link key={c.name} className="card facet-card" to={`/category/${encodeURIComponent(c.name)}`}>
            <div className="facet-card-title">{c.name}</div>
            <div className="muted">{t('categories.postsCount', { count: c.count })}</div>
          </Link>
        ))}
      </div>
    </Container>
  )
}
