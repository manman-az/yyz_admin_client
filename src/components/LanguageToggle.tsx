import { useMemo } from 'react'
import { useRevalidator } from 'react-router-dom'

import { useI18n } from '@/i18n/context'

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n()
  const revalidator = useRevalidator()

  const nextLocale = useMemo(() => (locale === 'zh-CN' ? 'en-US' : 'zh-CN'), [locale])
  const nextLabel = useMemo(() => (nextLocale === 'zh-CN' ? t('lang.zh') : t('lang.en')), [nextLocale, t])

  return (
    <button
      type="button"
      className="btn btn-ghost"
      aria-label={t('lang.switchTo', { lang: nextLabel })}
      onClick={() => {
        setLocale(nextLocale)
        revalidator.revalidate()
      }}
    >
      {nextLabel}
    </button>
  )
}
