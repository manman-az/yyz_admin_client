import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { I18nContext, type I18nContextValue } from '@/i18n/context'
import { formatMessage, getLocale, messages, persistLocale, type Locale, type MessageKey } from '@/i18n/messages'

type Props = {
  children: ReactNode
}

export function I18nProvider({ children }: Props) {
  const [locale, setLocaleState] = useState<Locale>(() => getLocale())

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    persistLocale(next)
    document.documentElement.lang = next
    setLocaleState(next)
  }, [])

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      const table = messages[locale] ?? messages['en-US']
      const template = table[key] ?? messages['en-US'][key] ?? String(key)
      return formatMessage(template, vars)
    },
    [locale],
  )

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
