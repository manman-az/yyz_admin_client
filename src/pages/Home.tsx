import { Link, useLoaderData, useLocation } from 'react-router-dom'

import { Container } from '@/components/Container'
import { Pagination } from '@/components/Pagination'
import { PostCard } from '@/components/PostCard'
import { TagChip } from '@/components/TagChip'
import { useI18n } from '@/i18n/context'
import type { HomeLoaderData } from '@/router/loaders'

export function Home() {
  const { t } = useI18n()
  const data = useLoaderData() as HomeLoaderData
  const location = useLocation()

  const headerTitle = data.tag
    ? t('home.title.tag', { tag: data.tag })
    : data.category
      ? t('home.title.category', { category: data.category })
      : data.q
        ? t('home.title.search', { q: data.q })
        : t('home.title.latest')

  const totalLabel = t(data.posts.total === 1 ? 'home.total_one' : 'home.total_other', { count: data.posts.total })

  function hrefForPage(page: number) {
    const sp = new URLSearchParams()
    if (data.q) sp.set('q', data.q)
    if (page > 1) sp.set('page', String(page))
    const qs = sp.toString()
    return qs ? `${location.pathname}?${qs}` : location.pathname
  }

  const hasFilters = Boolean(data.tag || data.category || data.q)

  return (
    <Container>
      <section className="page-header">
        <div>
          <h1 className="page-title">{headerTitle}</h1>
          <div className="page-subtitle">
            <span className="muted">{totalLabel}</span>
            {hasFilters && (
              <>
                <span className="dot" aria-hidden="true">
                  ·
                </span>
                <Link className="muted" to="/">
                  {t('home.clearFilters')}
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="page-actions">
          <TagChip to="/tags" label={t('home.browseTags')} className="chip-soft" />
          <TagChip to="/categories" label={t('home.browseCategories')} className="chip-soft" />
        </div>
      </section>

      <div className="home-grid">
        <section className="feed" aria-label="Post list">
          <div className="feed-list">
            {data.posts.items.length === 0 ? (
              <div className="card empty-card">
                <div className="empty-title">{t('home.noPostsTitle')}</div>
                <div className="muted">{t('home.noPostsHint')}</div>
                <Link className="btn" to="/">
                  {t('home.clearFilters')}
                </Link>
              </div>
            ) : (
              data.posts.items.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>

          <Pagination
            page={data.posts.page}
            pageSize={data.posts.pageSize}
            total={data.posts.total}
            hrefForPage={hrefForPage}
          />
        </section>

        <aside className="sidebar" aria-label="Sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title">{t('nav.tags')}</div>
            <div className="facet-list">
              {data.tags.map((tag) => (
                <Link key={tag.name} className="facet" to={`/tag/${encodeURIComponent(tag.name)}`}>
                  <span>#{tag.name}</span>
                  <span className="facet-count">{tag.count}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">{t('nav.categories')}</div>
            <div className="facet-list">
              {data.categories.map((c) => (
                <Link key={c.name} className="facet" to={`/category/${encodeURIComponent(c.name)}`}>
                  <span>{c.name}</span>
                  <span className="facet-count">{c.count}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">{t('home.quickLinks')}</div>
            <div className="facet-list">
              <Link className="facet" to="/archive">
                <span>{t('nav.archive')}</span>
                <span className="facet-count">→</span>
              </Link>
              <Link className="facet" to="/about">
                <span>{t('nav.about')}</span>
                <span className="facet-count">→</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  )
}
