export function clampInt(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

export function formatDate(isoString: string, locale?: string) {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return isoString

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date)
}

export function estimateReadingMinutes(text: string) {
  const words = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length

  const wordsPerMinute = 220
  return Math.max(1, Math.round(words / wordsPerMinute))
}

