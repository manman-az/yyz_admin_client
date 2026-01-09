import { useEffect, useMemo, useState } from 'react'

import { useI18n } from '@/i18n/context'

type Props = {
  storageKey: string
  question: string
  options: string[]
  persist: boolean
}

type PollState = {
  votedIndex: number | null
  counts: number[]
}

function safeParseState(raw: string | null, optionsCount: number): PollState | null {
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as Partial<PollState>
    const votedIndex = typeof data.votedIndex === 'number' ? data.votedIndex : null
    const counts = Array.isArray(data.counts) ? data.counts.map((n) => Number(n) || 0) : []
    if (counts.length !== optionsCount) return null
    if (votedIndex !== null && (votedIndex < 0 || votedIndex >= optionsCount)) return null
    return { votedIndex, counts }
  } catch {
    return null
  }
}

export function PollWidget({ storageKey, question, options, persist }: Props) {
  const { t } = useI18n()
  const initial = useMemo<PollState>(() => {
    if (!persist) return { votedIndex: null, counts: Array.from({ length: options.length }, () => 0) }
    return safeParseState(localStorage.getItem(storageKey), options.length) ?? {
      votedIndex: null,
      counts: Array.from({ length: options.length }, () => 0),
    }
  }, [options.length, persist, storageKey])

  const [state, setState] = useState<PollState>(initial)

  useEffect(() => {
    if (!persist) return
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [persist, state, storageKey])

  const total = state.counts.reduce((sum, n) => sum + n, 0)

  function vote(nextIndex: number) {
    setState((prev) => {
      const nextCounts = prev.counts.slice()

      if (prev.votedIndex === null) {
        nextCounts[nextIndex] = (nextCounts[nextIndex] ?? 0) + 1
        return { votedIndex: nextIndex, counts: nextCounts }
      }

      if (prev.votedIndex === nextIndex) return prev

      nextCounts[prev.votedIndex] = Math.max(0, (nextCounts[prev.votedIndex] ?? 0) - 1)
      nextCounts[nextIndex] = (nextCounts[nextIndex] ?? 0) + 1
      return { votedIndex: nextIndex, counts: nextCounts }
    })
  }

  return (
    <div className="md-widget widget-card poll">
      <div className="widget-title">{question}</div>
      <div className="poll-options">
        {options.map((opt, idx) => {
          const count = state.counts[idx] ?? 0
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          const active = state.votedIndex === idx

          return (
            <button
              key={opt}
              type="button"
              className={active ? 'poll-option active' : 'poll-option'}
              onClick={() => vote(idx)}
            >
              <div className="poll-option-top">
                <span className="poll-label">{opt}</span>
                <span className="poll-meta muted">
                  {total > 0 ? `${pct}%` : '—'}
                </span>
              </div>
              <div className="poll-bar" aria-hidden="true">
                <div className="poll-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </button>
          )
        })}
      </div>
      <div className="widget-hint muted">
        {persist ? t('widget.poll.totalLocal', { total }) : t('widget.poll.total', { total })}
      </div>
    </div>
  )
}
