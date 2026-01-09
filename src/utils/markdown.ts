export type TocItem = {
  id: string
  text: string
  level: number
}

export type MarkdownWidget =
  | {
      type: 'counter'
      id: string
      label: string
      start: number
      persist: boolean
    }
  | {
      type: 'poll'
      id: string
      question: string
      options: string[]
      persist: boolean
    }
  | {
      type: 'spoiler'
      id: string
      title: string
      content: string
    }

export type MarkdownBlock = { kind: 'html'; html: string } | { kind: 'widget'; widget: MarkdownWidget }

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function sanitizeUrl(url: string) {
  const trimmed = url.trim()
  const lower = trimmed.toLowerCase()
  const isAllowed =
    lower.startsWith('https://') ||
    lower.startsWith('http://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('/') ||
    lower.startsWith('#')

  if (!isAllowed) return '#'
  return trimmed.replaceAll('"', '%22')
}

function slugify(value: string) {
  const ascii = value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return ascii || 'section'
}

function hashString(value: string) {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16)
}

function renderInline(raw: string) {
  const tokens: string[] = []
  let text = raw

  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, altRaw: string, urlRaw: string) => {
    const alt = escapeHtml(altRaw)
    const src = sanitizeUrl(urlRaw)
    const idx = tokens.push(`<img class="md-img" src="${src}" alt="${alt}" loading="lazy" />`) - 1
    return `@@TOK_${idx}@@`
  })

  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, labelRaw: string, urlRaw: string) => {
    const label = escapeHtml(labelRaw)
    const href = sanitizeUrl(urlRaw)
    const isExternal = /^https?:\/\//i.test(href)
    const extra = isExternal ? ' target="_blank" rel="noreferrer"' : ''
    const idx = tokens.push(`<a href="${href}"${extra}>${label}</a>`) - 1
    return `@@TOK_${idx}@@`
  })

  text = text.replace(/`([^`]+)`/g, (_m, codeRaw: string) => {
    const idx = tokens.push(`<code>${escapeHtml(codeRaw)}</code>`) - 1
    return `@@TOK_${idx}@@`
  })

  let out = escapeHtml(text)
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>')

  out = out.replace(/@@TOK_(\d+)@@/g, (_m, num: string) => tokens[Number(num)] ?? '')
  return out
}

function parseWidgetConfig(lines: string[]) {
  const config: Record<string, string> = {}
  const rest: string[] = []

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    const idx = line.indexOf(':')
    if (idx > 0) {
      const key = line.slice(0, idx).trim()
      const value = line.slice(idx + 1).trim()
      config[key] = value
      continue
    }
    rest.push(raw)
  }

  return { config, rest }
}

function parseBool(value: string | undefined) {
  if (!value) return false
  return value.trim().toLowerCase() === 'true'
}

function parseIntOr(value: string | undefined, fallback: number) {
  if (!value) return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function parseWidget(typeRaw: string, headerArg: string | undefined, lines: string[]): MarkdownWidget | null {
  const type = typeRaw.trim().toLowerCase()
  const { config, rest } = parseWidgetConfig(lines)
  const baseId = config.id?.trim() || hashString([type, headerArg ?? '', ...lines].join('\n'))

  if (type === 'counter') {
    const label = (config.label || headerArg || 'Counter').trim()
    const start = parseIntOr(config.start, 0)
    const persist = parseBool(config.persist)
    return { type: 'counter', id: baseId, label, start, persist }
  }

  if (type === 'poll') {
    const options = lines
      .map((l) => l.trim())
      .filter(Boolean)
      .filter((l) => l.startsWith('-'))
      .map((l) => l.replace(/^-+\s*/, '').trim())
      .filter(Boolean)

    const question = (config.question || headerArg || rest.join(' ').trim() || 'Poll').trim()
    const persist = parseBool(config.persist)
    if (options.length === 0) return null
    return { type: 'poll', id: baseId, question, options, persist }
  }

  if (type === 'spoiler') {
    const title = (headerArg || config.title || 'Details').trim()
    const content = lines.join('\n').trim()
    return { type: 'spoiler', id: baseId, title, content }
  }

  return null
}

export function markdownToBlocks(markdown: string): { blocks: MarkdownBlock[]; toc: TocItem[] } {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  const blocks: MarkdownBlock[] = []
  const htmlParts: string[] = []
  const toc: TocItem[] = []

  const headingIds = new Map<string, number>()

  let paragraph: string[] = []
  let list: { kind: 'ul' | 'ol'; items: string[] } | null = null
  let blockquote: string[] | null = null
  let code: { lang: string; lines: string[] } | null = null

  function flushHtmlBlock() {
    if (htmlParts.length === 0) return
    blocks.push({ kind: 'html', html: htmlParts.join('\n') })
    htmlParts.length = 0
  }

  function flushParagraph() {
    if (paragraph.length === 0) return
    const text = paragraph.join(' ').trim()
    if (text) htmlParts.push(`<p>${renderInline(text)}</p>`)
    paragraph = []
  }

  function flushList() {
    if (!list) return
    const itemsHtml = list.items.map((item) => `<li>${renderInline(item)}</li>`).join('')
    htmlParts.push(`<${list.kind}>${itemsHtml}</${list.kind}>`)
    list = null
  }

  function flushBlockquote() {
    if (!blockquote) return
    const parts = blockquote
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${renderInline(line)}</p>`)
      .join('')
    if (parts) htmlParts.push(`<blockquote>${parts}</blockquote>`)
    blockquote = null
  }

  function flushCode() {
    if (!code) return
    const lang = code.lang ? ` class="language-${escapeHtml(code.lang)}"` : ''
    const body = escapeHtml(code.lines.join('\n'))
    htmlParts.push(`<pre><code${lang}>${body}</code></pre>`)
    code = null
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i] ?? ''
    const line = rawLine.replace(/\s+$/g, '')

    if (code) {
      if (line.startsWith('```')) {
        flushCode()
        continue
      }
      code.lines.push(rawLine)
      continue
    }

    const widgetStart = /^:::\s*([a-zA-Z][\w-]*)(?:\s+(.*))?$/.exec(line.trim())
    if (widgetStart) {
      flushParagraph()
      flushList()
      flushBlockquote()
      flushCode()
      flushHtmlBlock()

      const widgetLines: string[] = []
      let closed = false
      for (let j = i + 1; j < lines.length; j++) {
        const l = (lines[j] ?? '').replace(/\s+$/g, '')
        if (l.trim() === ':::') {
          closed = true
          i = j
          break
        }
        widgetLines.push(lines[j] ?? '')
      }

      if (closed) {
        const widget = parseWidget(widgetStart[1] ?? '', widgetStart[2], widgetLines)
        if (widget) {
          blocks.push({ kind: 'widget', widget })
          continue
        }
      }

      paragraph.push(line)
      continue
    }

    if (line.startsWith('```')) {
      flushParagraph()
      flushList()
      flushBlockquote()
      code = { lang: line.replace(/^```/, '').trim(), lines: [] }
      continue
    }

    if (!line.trim()) {
      flushParagraph()
      flushList()
      flushBlockquote()
      continue
    }

    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line)
    if (headingMatch) {
      flushParagraph()
      flushList()
      flushBlockquote()
      const level = headingMatch[1].length
      const text = headingMatch[2].trim()
      const base = slugify(text)
      const count = (headingIds.get(base) ?? 0) + 1
      headingIds.set(base, count)
      const id = count === 1 ? base : `${base}-${count}`

      toc.push({ id, text, level })
      htmlParts.push(`<h${level} id="${id}">${renderInline(text)}</h${level}>`)
      continue
    }

    if (line.trim() === '---' || line.trim() === '***') {
      flushParagraph()
      flushList()
      flushBlockquote()
      htmlParts.push('<hr/>')
      continue
    }

    const quoteMatch = /^>\s?(.*)$/.exec(line)
    if (quoteMatch) {
      flushParagraph()
      flushList()
      blockquote ??= []
      blockquote.push(quoteMatch[1])
      continue
    }

    const olMatch = /^\d+\.\s+(.+)$/.exec(line)
    if (olMatch) {
      flushParagraph()
      flushBlockquote()
      if (!list || list.kind !== 'ol') {
        flushList()
        list = { kind: 'ol', items: [] }
      }
      list.items.push(olMatch[1])
      continue
    }

    const ulMatch = /^[-*]\s+(.+)$/.exec(line)
    if (ulMatch) {
      flushParagraph()
      flushBlockquote()
      if (!list || list.kind !== 'ul') {
        flushList()
        list = { kind: 'ul', items: [] }
      }
      list.items.push(ulMatch[1])
      continue
    }

    paragraph.push(line)
  }

  flushParagraph()
  flushList()
  flushBlockquote()
  flushCode()

  flushHtmlBlock()

  return { blocks, toc }
}

export function markdownToHtml(markdown: string): { html: string; toc: TocItem[] } {
  const rendered = markdownToBlocks(markdown)
  return {
    html: rendered.blocks
      .filter((b) => b.kind === 'html')
      .map((b) => b.html)
      .join('\n'),
    toc: rendered.toc,
  }
}
