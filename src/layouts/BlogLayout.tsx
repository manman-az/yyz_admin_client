import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router-dom'

import { Container } from '@/components/Container'
import { LanguageToggle } from '@/components/LanguageToggle'
import { SearchBox } from '@/components/SearchBox'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useI18n } from '@/i18n/context'
import { blogSite } from '@/services/blog'

export function BlogLayout() {
  const { t } = useI18n()

  return (
    <div className="app">
      <a className="skip-link" href="#content">
        {t('a11y.skipToContent')}
      </a>

      <header className="header">
        <Container className="header-inner">
          <div className="brand">
            <Link to="/" className="brand-link" aria-label={t('nav.home')}>
              {blogSite.title}
            </Link>
            <span className="brand-subtitle">{t('site.description')}</span>
          </div>

          <nav className="nav" aria-label="Primary">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/archive" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {t('nav.archive')}
            </NavLink>
            <NavLink to="/tags" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {t('nav.tags')}
            </NavLink>
            <NavLink to="/categories" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {t('nav.categories')}
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {t('nav.about')}
            </NavLink>
          </nav>

          <div className="header-actions">
            <SearchBox className="search" placeholder={t('search.placeholder')} ariaLabel={t('search.placeholder')} />
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </Container>
      </header>

      <main id="content" className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <Container className="footer-inner">
          <div className="muted">
            © {new Date().getFullYear()} {blogSite.author.name}. {t('footer.builtWith')}
          </div>
        </Container>
      </footer>

      <ScrollRestoration />
    </div>
  )
}
