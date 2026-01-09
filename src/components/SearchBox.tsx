import { type FormEvent, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

type Props = {
  className?: string
  placeholder?: string
  ariaLabel?: string
}

export function SearchBox({ className, placeholder, ariaLabel }: Props) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const inputRef = useRef<HTMLInputElement>(null)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next = inputRef.current?.value.trim() ?? ''
    navigate(next ? `/?q=${encodeURIComponent(next)}` : '/')
  }

  const label = ariaLabel ?? 'Search'

  return (
    <form className={className} onSubmit={onSubmit} role="search" aria-label={label}>
      <input
        key={q}
        ref={inputRef}
        className="input"
        defaultValue={q}
        placeholder={placeholder ?? 'Search…'}
        aria-label={label}
      />
    </form>
  )
}

