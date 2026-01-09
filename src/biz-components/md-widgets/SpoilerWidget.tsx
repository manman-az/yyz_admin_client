import type { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
}

export function SpoilerWidget({ title, children }: Props) {
  return (
    <details className="md-widget md-spoiler">
      <summary className="md-spoiler-summary">{title}</summary>
      <div className="md-spoiler-body">{children}</div>
    </details>
  )
}
