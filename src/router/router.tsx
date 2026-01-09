import { createBrowserRouter } from 'react-router-dom'

import { BlogLayout } from '@/layouts/BlogLayout'
import { AboutPage } from '@/pages/About'
import { ArchivePage } from '@/pages/Archive'
import { CategoriesPage } from '@/pages/Categories'
import { Home } from '@/pages/Home'
import { NotFoundPage } from '@/pages/NotFound'
import { PostPage } from '@/pages/Post'
import { RouteErrorPage } from '@/pages/RouteError'
import { TagsPage } from '@/pages/Tags'
import { archiveLoader, categoriesLoader, homeLoader, postLoader, tagsLoader } from '@/router/loaders'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BlogLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Home />, loader: homeLoader },
      { path: 'post/:slug', element: <PostPage />, loader: postLoader },
      { path: 'tag/:tag', element: <Home />, loader: homeLoader },
      { path: 'category/:category', element: <Home />, loader: homeLoader },
      { path: 'archive', element: <ArchivePage />, loader: archiveLoader },
      { path: 'tags', element: <TagsPage />, loader: tagsLoader },
      { path: 'categories', element: <CategoriesPage />, loader: categoriesLoader },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
