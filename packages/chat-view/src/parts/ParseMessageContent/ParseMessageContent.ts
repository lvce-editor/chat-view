import type { MessageInlineNode, MessageIntermediateNode, MessageListItemNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

const orderedListItemRegex = /^\s*\d+\.\s+(.*)$/
const markdownInlineRegex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g

const parseInlineNodes = (value: string): readonly MessageInlineNode[] => {
  const matches = value.matchAll(markdownInlineRegex)
  const nodes: MessageInlineNode[] = []
  let lastIndex = 0

  for (const match of matches) {
    const fullMatch = match[0]
    const linkText = match[1]
    const href = match[2]
    const boldText = match[3]
    const index = match.index ?? 0
    if (index > lastIndex) {
      nodes.push({
        text: value.slice(lastIndex, index),
        type: 'text',
      })
    }
    if (linkText && href) {
      nodes.push({
        href,
        text: linkText,
        type: 'link',
      })
    } else if (boldText) {
      nodes.push({
        text: boldText,
        type: 'bold',
      })
    }
    lastIndex = index + fullMatch.length
  }

  if (lastIndex < value.length) {
    nodes.push({
      text: value.slice(lastIndex),
      type: 'text',
    })
  }

  if (nodes.length === 0) {
    return [
      {
        text: value,
        type: 'text',
      },
    ]
  }

  return nodes
}

export const parseMessageContent = (rawMessage: string): readonly MessageIntermediateNode[] => {
  if (rawMessage === '') {
    return [
      {
        children: [
          {
            text: '',
            type: 'text',
          },
        ],
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
      children: parseInlineNodes(paragraphLines.join('\n')),
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
        children: parseInlineNodes(match[1]),
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
          children: [
            {
              text: '',
              type: 'text',
            },
          ],
          type: 'text',
        },
      ]
    : nodes
}
