import type { LoaderFunctionArgs } from 'react-router-dom'

import { getPostBySlug, listAllPostSummaries, listCategories, listPosts, listTags } from '@/services/blog'
import type { BlogFacetStat, BlogListPostsResult, BlogPost, BlogPostSummary } from '@/types/blog'
import { safeDecodeURIComponent } from '@/utils/blog'

export type HomeLoaderData = {
  q: string
  tag: string
  category: string
  posts: BlogListPostsResult
  tags: BlogFacetStat[]
  categories: BlogFacetStat[]
}

export async function homeLoader({ request, params }: LoaderFunctionArgs): Promise<HomeLoaderData> {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')?.trim() ?? ''
  const page = Number(url.searchParams.get('page') ?? '1') || 1

  const tag = params.tag ? safeDecodeURIComponent(params.tag) : (url.searchParams.get('tag')?.trim() ?? '')
  const category = params.category
    ? safeDecodeURIComponent(params.category)
    : (url.searchParams.get('category')?.trim() ?? '')

  const [posts, tags, categories] = await Promise.all([
    listPosts({ q, tag, category, page, pageSize: 6 }),
    listTags(),
    listCategories(),
  ])

  return { q, tag, category, posts, tags, categories }
}

export type PostLoaderData = {
  post: BlogPost
}

export async function postLoader({ params }: LoaderFunctionArgs): Promise<PostLoaderData> {
  const slug = params.slug ?? ''
  const post = await getPostBySlug(slug)
  if (!post) throw new Response('Not Found', { status: 404 })
  return { post }
}

export type TagsLoaderData = {
  tags: BlogFacetStat[]
}

export async function tagsLoader(args: LoaderFunctionArgs): Promise<TagsLoaderData> {
  void args
  const tags = await listTags()
  return { tags }
}

export type CategoriesLoaderData = {
  categories: BlogFacetStat[]
}

export async function categoriesLoader(args: LoaderFunctionArgs): Promise<CategoriesLoaderData> {
  void args
  const categories = await listCategories()
  return { categories }
}

export type ArchiveGroup = {
  year: number
  posts: BlogPostSummary[]
}

export type ArchiveLoaderData = {
  groups: ArchiveGroup[]
}

export async function archiveLoader(args: LoaderFunctionArgs): Promise<ArchiveLoaderData> {
  void args
  const posts = await listAllPostSummaries()
  const map = new Map<number, BlogPostSummary[]>()

  for (const post of posts) {
    const year = new Date(post.publishedAt).getFullYear()
    map.set(year, [...(map.get(year) ?? []), post])
  }

  const groups = Array.from(map.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, items]) => ({ year, posts: items }))

  return { groups }
}

