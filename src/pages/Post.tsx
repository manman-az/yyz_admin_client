import { useMemo } from 'react'
import { Link, useLoaderData } from 'react-router-dom'

import { Container } from '@/components/Container'
import { Markdown } from '@/components/Markdown'
import { TagChip } from '@/components/TagChip'
import { useI18n } from '@/i18n/context'
import type { PostLoaderData } from '@/router/loaders'
import { estimateReadingMinutes, formatDate } from '@/utils/blog'
import { markdownToBlocks } from '@/utils/markdown'

function coverStyle(post: PostLoaderData['post']) {
  if (post.cover.kind === 'gradient') return { backgroundImage: post.cover.value }
  return { backgroundImage: `url(${post.cover.src})` }
}

export function PostPage() {
  const { locale, t } = useI18n()
  const { post } = useLoaderData() as PostLoaderData
  const rendered = useMemo(() => markdownToBlocks(post.content), [post.content])
  const readingMinutes = estimateReadingMinutes(post.content)

  return (
    <Container>
      <div className="post-top">
        <Link className="muted" to="/">
          {t('post.backHome')}
        </Link>
      </div>

      <header className="post-hero card">
        <div className="post-hero-cover" style={coverStyle(post)} />
        <div className="post-hero-body">
          <div className="post-hero-meta">
            <TagChip to={`/category/${encodeURIComponent(post.category)}`} label={post.category} className="chip-soft" />
            <span className="dot" aria-hidden="true">
              ·
            </span>
            <span className="muted">{formatDate(post.publishedAt, locale)}</span>
            <span className="dot" aria-hidden="true">
              ·
            </span>
            <span className="muted">{t('post.readingTime', { minutes: readingMinutes })}</span>
          </div>

          <h1 className="post-hero-title">{post.title}</h1>
          <p className="post-hero-excerpt">{post.excerpt}</p>

          <div className="post-hero-tags">
            {post.tags.map((tag) => (
              <TagChip key={tag} to={`/tag/${encodeURIComponent(tag)}`} label={`#${tag}`} />
            ))}
          </div>
        </div>
      </header>

      <div className="post-layout">
        <article className="post-content">
          <Markdown blocks={rendered.blocks} namespace={`post:${post.slug}:${locale}`} />
        </article>

        <aside className="post-aside">
          <div className="sidebar-card">
            <div className="sidebar-title">{t('post.onThisPage')}</div>
            <div className="toc">
              {rendered.toc
                .filter((h) => h.level >= 2 && h.level <= 3)
                .map((h) => (
                  <a key={h.id} className={`toc-link lvl-${h.level}`} href={`#${h.id}`}>
                    {h.text}
                  </a>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </Container>
  )
}
