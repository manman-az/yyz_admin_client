import { useEffect, useMemo, useState } from 'react'

import { useI18n } from '@/i18n/context'

type Props = {
  storageKey: string
  label: string
  start: number
  persist: boolean
}

function readStoredNumber(storageKey: string) {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

export function CounterWidget({ storageKey, label, start, persist }: Props) {
  const { t } = useI18n()
  const initial = useMemo(() => {
    if (!persist) return start
    return readStoredNumber(storageKey) ?? start
  }, [persist, start, storageKey])

  const [count, setCount] = useState(initial)

  useEffect(() => {
    if (!persist) return
    localStorage.setItem(storageKey, String(count))
  }, [count, persist, storageKey])

  return (
    <div className="md-widget widget-card">
      <div className="widget-title">{label}</div>
      <div className="counter-row">
        <button
          type="button"
          className="btn"
          onClick={() => setCount((c) => c - 1)}
          aria-label={t('widget.counter.decrease')}
        >
          −
        </button>
        <div className="counter-value" aria-label="Count">
          {count}
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => setCount((c) => c + 1)}
          aria-label={t('widget.counter.increase')}
        >
          +
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setCount(start)} aria-label={t('widget.reset')}>
          {t('widget.reset')}
        </button>
      </div>
      {persist && <div className="widget-hint muted">{t('widget.savedLocally')}</div>}
    </div>
  )
}
