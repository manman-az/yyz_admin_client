import { useEffect, useMemo, useState } from 'react'

import { useI18n } from '@/i18n/context'

type Theme = 'light' | 'dark'

const storageKey = 'yyz_blog_theme'

function getInitialTheme(): Theme {
  const fromStorage = localStorage.getItem(storageKey)
  if (fromStorage === 'light' || fromStorage === 'dark') return fromStorage

  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const { t } = useI18n()
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())
  const nextTheme = useMemo<Theme>(() => (theme === 'dark' ? 'light' : 'dark'), [theme])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(storageKey, theme)
  }, [theme])

  const currentLabel = theme === 'dark' ? t('theme.dark') : t('theme.light')
  const nextLabel = nextTheme === 'dark' ? t('theme.dark') : t('theme.light')

  return (
    <button
      type="button"
      className="btn btn-ghost"
      onClick={() => setTheme(nextTheme)}
      aria-label={t('theme.switchTo', { theme: nextLabel })}
    >
      {currentLabel}
    </button>
  )
}
