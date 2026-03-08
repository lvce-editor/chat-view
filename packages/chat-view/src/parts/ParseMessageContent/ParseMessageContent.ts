import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export type MessageIntermediateNode = MessageTextNode | MessageListNode

export interface MessageTextNode {
  readonly text: string
  readonly type: 'text'
}

export interface MessageListNode {
  readonly items: readonly MessageListItemNode[]
  readonly type: 'list'
}

export interface MessageListItemNode {
  readonly text: string
  readonly type: 'list-item'
}

const orderedListItemRegex = /^\s*\d+\.\s+(.*)$/

export const parseMessageContent = (rawMessage: string): readonly MessageIntermediateNode[] => {
  if (rawMessage === '') {
    return [
      {
        text: '',
        type: 'text',
      },
    ]
  }

  const lines = rawMessage.split(/\r?\n/)
  const nodes: MessageIntermediateNode[] = []
  let paragraphLines: string[] = []
  let listItems: MessageListItemNode[] = []

  const flushParagraph = (): void => {
    if (paragraphLines.length === 0) {
      return
    }
    nodes.push({
      text: paragraphLines.join('\n'),
      type: 'text',
    })
    paragraphLines = []
  }

  const flushList = (): void => {
    if (listItems.length === 0) {
      return
    }
    nodes.push({
      items: listItems,
      type: 'list',
    })
    listItems = []
  }

  for (const line of lines) {
    if (!line.trim()) {
      flushList()
      flushParagraph()
      continue
    }

    const match = line.match(orderedListItemRegex)
    if (match) {
      flushParagraph()
      listItems.push({
        text: match[1],
        type: 'list-item',
      })
      continue
    }

    flushList()
    paragraphLines.push(line)
  }

  flushList()
  flushParagraph()

  return nodes.length === 0
    ? [
        {
          text: '',
          type: 'text',
        },
      ]
    : nodes
}

export const getMessageContentDom = (nodes: readonly MessageIntermediateNode[]): readonly VirtualDomNode[] => {
  return nodes.flatMap((node) => {
    if (node.type === 'text') {
      return [
        {
          childCount: 1,
          className: ClassNames.Markdown,
          type: VirtualDomElements.P,
        },
        text(node.text),
      ]
    }
    return [
      {
        childCount: node.items.length,
        className: ClassNames.ChatOrderedList,
        type: VirtualDomElements.Ol,
      },
      ...node.items.flatMap((item) => {
        return [
          {
            childCount: 1,
            className: ClassNames.ChatOrderedListItem,
            type: VirtualDomElements.Li,
          },
          text(item.text),
        ]
      }),
    ]
  })
}
