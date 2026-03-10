import type { MessageInlineNode, MessageIntermediateNode, MessageListItemNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

const orderedListItemRegex = /^\s*\d+\.\s+(.*)$/
const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
const customUiRegex = /<custom-ui>\s*<html>([\s\S]*?)<\/html>\s*(?:<css>([\s\S]*?)<\/css>)?\s*<\/custom-ui>/gi
const fencedBlockRegex = /^\s*```/

const parseInlineNodes = (value: string): readonly MessageInlineNode[] => {
  const matches = value.matchAll(markdownLinkRegex)
  const nodes: MessageInlineNode[] = []
  let lastIndex = 0

  for (const match of matches) {
    const fullMatch = match[0]
    const linkText = match[1]
    const href = match[2]
    const index = match.index ?? 0
    if (index > lastIndex) {
      nodes.push({
        text: value.slice(lastIndex, index),
        type: 'text',
      })
    }
    nodes.push({
      href,
      text: linkText,
      type: 'link',
    })
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

const getEmptyMessageNode = (): MessageIntermediateNode => {
  return {
    children: [
      {
        text: '',
        type: 'text',
      },
    ],
    type: 'text',
  }
}

const parseTextNodes = (rawMessage: string): readonly MessageIntermediateNode[] => {
  const lines = rawMessage.split(/\r?\n/)
  const nodes: MessageIntermediateNode[] = []
  let paragraphLines: string[] = []
  let listItems: MessageListItemNode[] = []
  let rawContentLines: string[] = []
  let inRawContentBlock = false

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

  const flushRawContent = (): void => {
    nodes.push({
      text: rawContentLines.join('\n'),
      type: 'raw-content',
    })
    rawContentLines = []
  }

  for (const line of lines) {
    if (inRawContentBlock) {
      if (fencedBlockRegex.test(line)) {
        inRawContentBlock = false
        flushRawContent()
      } else {
        rawContentLines.push(line)
      }
      continue
    }

    if (fencedBlockRegex.test(line)) {
      flushList()
      flushParagraph()
      inRawContentBlock = true
      rawContentLines = []
      continue
    }

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

  if (inRawContentBlock) {
    flushRawContent()
  }

  return nodes
}

export const parseMessageContent = (rawMessage: string): readonly MessageIntermediateNode[] => {
  if (rawMessage === '') {
    return [getEmptyMessageNode()]
  }

  const nodes: MessageIntermediateNode[] = []
  const matches = rawMessage.matchAll(customUiRegex)
  let lastIndex = 0

  for (const match of matches) {
    const index = match.index ?? 0
    if (index > lastIndex) {
      nodes.push(...parseTextNodes(rawMessage.slice(lastIndex, index)))
    }
    nodes.push({
      css: String(match[2] ?? ''),
      html: String(match[1] ?? ''),
      type: 'custom-ui',
    })
    lastIndex = index + match[0].length
  }

  if (lastIndex < rawMessage.length) {
    nodes.push(...parseTextNodes(rawMessage.slice(lastIndex)))
  }

  return nodes.length === 0 ? [getEmptyMessageNode()] : nodes
}
