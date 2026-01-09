import { Link } from 'react-router-dom'

import { TagChip } from '@/components/TagChip'
import { useI18n } from '@/i18n/context'
import type { BlogPostSummary } from '@/types/blog'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/blog'

type Props = {
  post: BlogPostSummary
}

function coverStyle(post: BlogPostSummary) {
  if (post.cover.kind === 'gradient') return { backgroundImage: post.cover.value }
  return { backgroundImage: `url(${post.cover.src})` }
}

export function PostCard({ post }: Props) {
  const { locale } = useI18n()

  return (
    <article className="card post-card">
      <Link className="post-cover" to={`/post/${post.slug}`} style={coverStyle(post)} aria-label={post.title} />

      <div className="post-body">
        <div className="post-meta">
          <span className="muted">{formatDate(post.publishedAt, locale)}</span>
          <span className="dot" aria-hidden="true">
            ·
          </span>
          <TagChip to={`/category/${encodeURIComponent(post.category)}`} label={post.category} className="chip-soft" />
        </div>

        <h2 className="post-title">
          <Link to={`/post/${post.slug}`}>{post.title}</Link>
        </h2>

        <p className="post-excerpt">{post.excerpt}</p>

        <div className={cn('post-tags', post.tags.length === 0 && 'hidden')}>
          {post.tags.map((tag) => (
            <TagChip key={tag} to={`/tag/${encodeURIComponent(tag)}`} label={`#${tag}`} />
          ))}
        </div>
      </div>
    </article>
  )
}
