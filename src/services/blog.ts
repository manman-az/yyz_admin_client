import type { Locale } from '@/i18n/messages'
import { getLocale } from '@/i18n/messages'
import type {
  BlogCover,
  BlogFacetStat,
  BlogListPostsParams,
  BlogListPostsResult,
  BlogPost,
  BlogPostSummary,
  BlogSiteConfig,
} from '@/types/blog'
import { clampInt, normalizeText } from '@/utils/blog'

export const blogSite: BlogSiteConfig = {
  title: 'YYZ Blog',
  description: 'Notes on building, writing, and living — one post at a time.',
  author: { name: 'YYZ', handle: '@yyz' },
  social: {
    github: 'https://github.com/',
    x: 'https://x.com/',
    email: 'hello@example.com',
  },
}

type LocalizedPost = BlogPost & { locale: Locale }

const RAW_POSTS = import.meta.glob<string>('/src/content/posts/*/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function parseFrontMatter(raw: string) {
  const text = raw.replace(/\r\n?/g, '\n')
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text)
  if (!match) return { meta: {} as Record<string, string>, body: text }

  const metaText = match[1]
  const meta: Record<string, string> = {}
  for (const line of metaText.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf(':')
    if (idx <= 0) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    meta[key] = value
  }

  const body = text.slice(match[0].length)
  return { meta, body }
}

function parseTags(value: string | undefined) {
  if (!value) return [] as string[]

  const trimmed = value.trim()
  if (!trimmed) return []

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inner = trimmed.slice(1, -1)
    return inner
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => t.replace(/^['"]|['"]$/g, ''))
  }

  return trimmed
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

function parseBoolean(value: string | undefined) {
  if (!value) return false
  return value.trim().toLowerCase() === 'true'
}

function normalizeIsoDate(value: string | undefined) {
  if (!value) return null
  const v = value.trim()
  if (!v) return null
  if (v.includes('T')) return v
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return `${v}T00:00:00.000Z`
  return v
}

function toCover(value: string | undefined): BlogCover {
  const cover = value?.trim() ?? ''
  if (!cover) return { kind: 'gradient', value: 'linear-gradient(135deg,#60a5fa,#a78bfa)' }
  if (cover.startsWith('linear-gradient') || cover.startsWith('radial-gradient')) return { kind: 'gradient', value: cover }
  return { kind: 'image', src: cover, alt: 'cover' }
}

function byPublishedDesc(a: BlogPost, b: BlogPost) {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
}

function toSummary(post: BlogPost): BlogPostSummary {
  const { content, ...summary } = post
  void content
  return summary
}

function contains(haystack: string, needle: string) {
  return normalizeText(haystack).includes(normalizeText(needle))
}

function parseLocaleFileName(fileName: string): Locale | null {
  const base = fileName.replace(/\.md$/i, '')
  if (base === 'zh-CN' || base === 'en-US') return base
  return null
}

function buildPosts(): LocalizedPost[] {
  const entries = Object.entries(RAW_POSTS)
  const posts: LocalizedPost[] = []

  for (const [path, content] of entries) {
    const parts = path.split('/')
    const fileName = parts[parts.length - 1] ?? ''
    const slug = parts[parts.length - 2] ?? ''
    const locale = parseLocaleFileName(fileName)
    if (!slug || !locale) continue

    const { meta, body } = parseFrontMatter(content)
    if (parseBoolean(meta.draft)) continue

    const publishedAt = normalizeIsoDate(meta.date ?? meta.publishedAt) ?? new Date().toISOString()
    const updatedAt = normalizeIsoDate(meta.updated ?? meta.updatedAt) ?? undefined

    const post: LocalizedPost = {
      id: `${slug}:${locale}`,
      slug,
      locale,
      title: meta.title || slug,
      excerpt: meta.excerpt || '',
      content: body.trim(),
      cover: toCover(meta.cover),
      category: meta.category || 'General',
      tags: parseTags(meta.tags),
      author: blogSite.author,
      publishedAt,
      updatedAt,
    }

    posts.push(post)
  }

  return posts.sort((a, b) => byPublishedDesc(a, b))
}

const ALL_POSTS = buildPosts()

function postsForLocale(locale: Locale): LocalizedPost[] {
  return ALL_POSTS.filter((p) => p.locale === locale)
}

export async function listPosts(params: (BlogListPostsParams & { locale?: Locale }) = {}): Promise<BlogListPostsResult> {
  const locale = params.locale ?? getLocale()
  const q = params.q?.trim() || ''
  const tag = params.tag?.trim() || ''
  const category = params.category?.trim() || ''

  const pageSize = clampInt(params.pageSize ?? 8, 1, 50)
  const page = clampInt(params.page ?? 1, 1, 10_000)

  const filtered = postsForLocale(locale).filter((post) => {
    if (tag && !post.tags.some((t) => normalizeText(t) === normalizeText(tag))) return false
    if (category && normalizeText(post.category) !== normalizeText(category)) return false
    if (!q) return true

    return (
      contains(post.title, q) ||
      contains(post.excerpt, q) ||
      post.tags.some((t) => contains(t, q)) ||
      contains(post.category, q)
    )
  })

  const total = filtered.length
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize).map(toSummary)

  return { items, total, page, pageSize }
}

export async function listAllPostSummaries(locale: Locale = getLocale()): Promise<BlogPostSummary[]> {
  return postsForLocale(locale).map(toSummary)
}

export async function getPostBySlug(slug: string, locale: Locale = getLocale()): Promise<BlogPost | null> {
  const found = ALL_POSTS.find((p) => p.slug === slug && p.locale === locale)
  if (found) return found

  const fallback = ALL_POSTS.find((p) => p.slug === slug)
  return fallback ?? null
}

export async function getPostLocales(slug: string): Promise<Locale[]> {
  const set = new Set<Locale>()
  for (const post of ALL_POSTS) {
    if (post.slug === slug) set.add(post.locale)
  }
  return Array.from(set.values()).sort()
}

export async function listTags(locale: Locale = getLocale()): Promise<BlogFacetStat[]> {
  const map = new Map<string, number>()
  for (const post of postsForLocale(locale)) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1)
    }
  }

  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export async function listCategories(locale: Locale = getLocale()): Promise<BlogFacetStat[]> {
  const map = new Map<string, number>()
  for (const post of postsForLocale(locale)) {
    map.set(post.category, (map.get(post.category) ?? 0) + 1)
  }

  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}
