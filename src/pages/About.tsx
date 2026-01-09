import { Container } from '@/components/Container'
import { Markdown } from '@/components/Markdown'
import { useI18n } from '@/i18n/context'
import { blogSite } from '@/services/blog'

export function AboutPage() {
  const { t } = useI18n()

  const aboutContent = [
    t('about.line.intro', { name: blogSite.author.name }),
    '',
    t('about.line.stack'),
    '',
    '- React 19 + TypeScript',
    '- React Router (data router)',
    '- Vite',
    '',
    t('about.line.contact'),
    '',
    blogSite.social?.email ? t('about.line.email', { email: blogSite.social.email }) : '',
    blogSite.social?.github ? t('about.line.github', { github: blogSite.social.github }) : '',
    blogSite.social?.x ? t('about.line.x', { x: blogSite.social.x }) : '',
  ].filter(Boolean)

  return (
    <Container>
      <section className="page-header">
        <div>
          <h1 className="page-title">{t('about.title')}</h1>
          <div className="page-subtitle muted">{t('about.subtitle')}</div>
        </div>
      </section>

      <div className="card about-card">
        <Markdown content={aboutContent.join('\n')} namespace="about" />
      </div>
    </Container>
  )
}
