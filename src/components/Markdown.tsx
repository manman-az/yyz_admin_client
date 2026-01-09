import { useMemo } from 'react'

import { CounterWidget } from '@/biz-components/md-widgets/CounterWidget'
import { PollWidget } from '@/biz-components/md-widgets/PollWidget'
import { SpoilerWidget } from '@/biz-components/md-widgets/SpoilerWidget'
import type { MarkdownBlock } from '@/utils/markdown'
import { markdownToBlocks } from '@/utils/markdown'

type Props =
  | {
      content: string
      namespace?: string
    }
  | {
      blocks: MarkdownBlock[]
      namespace?: string
    }

export function Markdown(props: Props) {
  const namespace = props.namespace ?? 'md'

  const content = 'content' in props ? props.content : ''
  const computedBlocks = useMemo(() => markdownToBlocks(content).blocks, [content])
  const blocks = 'blocks' in props ? props.blocks : computedBlocks

  return (
    <div className="md">
      {blocks.map((block, idx) => {
        if (block.kind === 'html') {
          return <div key={`${namespace}:html:${idx}`} dangerouslySetInnerHTML={{ __html: block.html }} />
        }

        const key = `${namespace}:${block.widget.type}:${block.widget.id}:${idx}`

        if (block.widget.type === 'counter') {
          return (
            <CounterWidget
              key={key}
              storageKey={`yyz_blog_widget:counter:${namespace}:${block.widget.id}`}
              label={block.widget.label}
              start={block.widget.start}
              persist={block.widget.persist}
            />
          )
        }

        if (block.widget.type === 'poll') {
          return (
            <PollWidget
              key={key}
              storageKey={`yyz_blog_widget:poll:${namespace}:${block.widget.id}`}
              question={block.widget.question}
              options={block.widget.options}
              persist={block.widget.persist}
            />
          )
        }

        if (block.widget.type === 'spoiler') {
          return (
            <SpoilerWidget key={key} title={block.widget.title}>
              <Markdown content={block.widget.content} namespace={`${namespace}:spoiler:${block.widget.id}`} />
            </SpoilerWidget>
          )
        }

        return null
      })}
    </div>
  )
}
