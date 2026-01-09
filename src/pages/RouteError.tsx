import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

import { Container } from '@/components/Container'
import { useI18n } from '@/i18n/context'

export function RouteErrorPage() {
  const { t } = useI18n()
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText || 'Error'}`
    : t('error.generic')

  return (
    <Container>
      <div className="notfound">
        <h1 className="page-title">{t('error.title')}</h1>
        <p className="muted">{message}</p>
        <Link className="btn" to="/">
          {t('error.back')}
        </Link>
      </div>
    </Container>
  )
}
