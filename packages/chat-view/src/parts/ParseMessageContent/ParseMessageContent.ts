import type { MessageIntermediateNode, MessageListItemNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

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
