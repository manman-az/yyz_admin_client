import { Link } from 'react-router-dom'

import { Container } from '@/components/Container'
import { useI18n } from '@/i18n/context'

export function NotFoundPage() {
  const { t } = useI18n()

  return (
    <Container>
      <div className="notfound">
        <h1 className="page-title">{t('notfound.title')}</h1>
        <p className="muted">{t('notfound.text')}</p>
        <Link className="btn" to="/">
          {t('notfound.back')}
        </Link>
      </div>
    </Container>
  )
}
