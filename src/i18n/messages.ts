import { enUS } from '@/i18n/locales/en-US'
import { zhCN } from '@/i18n/locales/zh-CN'

export type Locale = 'zh-CN' | 'en-US'

export const localeOptions: Array<{ code: Locale; label: string }> = [
  { code: 'zh-CN', label: '中文' },
  { code: 'en-US', label: 'English (US)' },
]

export type MessageKey = keyof typeof enUS

export const messages: Record<Locale, Record<MessageKey, string>> = {
  'en-US': enUS,
  'zh-CN': zhCN,
}

export function detectLocale(): Locale {
  const lang = (navigator.languages?.[0] || navigator.language || '').toLowerCase()
  if (lang.startsWith('zh')) return 'zh-CN'
  return 'en-US'
}

const storageKey = 'yyz_blog_locale'

export function getLocale(): Locale {
  const raw = localStorage.getItem(storageKey)
  if (raw === 'zh-CN' || raw === 'en-US') return raw
  return detectLocale()
}

export function persistLocale(locale: Locale) {
  localStorage.setItem(storageKey, locale)
}

export function formatMessage(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_m, key: string) => String(vars[key] ?? `{${key}}`))
}

