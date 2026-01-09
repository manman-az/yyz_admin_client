export type BlogCover =
  | { kind: 'gradient'; value: string }
  | { kind: 'image'; src: string; alt: string }

export type BlogAuthor = {
  name: string
  handle?: string
  avatarSrc?: string
}

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover: BlogCover
  category: string
  tags: string[]
  author: BlogAuthor
  publishedAt: string
  updatedAt?: string
}

export type BlogPostSummary = Pick<
  BlogPost,
  'id' | 'slug' | 'title' | 'excerpt' | 'cover' | 'category' | 'tags' | 'author' | 'publishedAt' | 'updatedAt'
>

export type BlogListPostsParams = {
  q?: string
  tag?: string
  category?: string
  page?: number
  pageSize?: number
}

export type BlogListPostsResult = {
  items: BlogPostSummary[]
  total: number
  page: number
  pageSize: number
}

export type BlogFacetStat = {
  name: string
  count: number
}

export type BlogSiteConfig = {
  title: string
  description: string
  author: BlogAuthor
  social?: {
    github?: string
    x?: string
    email?: string
  }
}

