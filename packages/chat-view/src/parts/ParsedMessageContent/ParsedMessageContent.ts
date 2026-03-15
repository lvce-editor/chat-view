import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type {
  MessageInlineNode,
  MessageIntermediateNode,
  MessageListItemNode,
  MessageTableCellNode,
} from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ChatMathWorker from '../ChatMathWorker/ChatMathWorker.ts'
import { parseMessageContent } from '../ParseMessageContent/ParseMessageContent.ts'

const emptyMessageContent: readonly MessageIntermediateNode[] = [
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

const primeInlineMath = async (children: readonly MessageInlineNode[]): Promise<void> => {
  for (const child of children) {
    if (child.type !== 'math-inline') {
      continue
    }
    await ChatMathWorker.renderToString(child.text, child.displayMode)
  }
}

const primeListItemMath = async (item: MessageListItemNode): Promise<void> => {
  await primeInlineMath(item.children)
  if (!item.nestedItems) {
    return
  }
  for (const nestedItem of item.nestedItems) {
    await primeListItemMath(nestedItem)
  }
}

const primeTableCellMath = async (cell: MessageTableCellNode): Promise<void> => {
  await primeInlineMath(cell.children)
}

const primeMathRenderCache = async (parsedContent: readonly MessageIntermediateNode[]): Promise<void> => {
  for (const node of parsedContent) {
    if (node.type === 'math-block') {
      await ChatMathWorker.renderToString(node.text, true)
      continue
    }
    if (node.type === 'text' || node.type === 'heading') {
      await primeInlineMath(node.children)
      continue
    }
    if (node.type === 'ordered-list' || node.type === 'unordered-list') {
      for (const item of node.items) {
        await primeListItemMath(item)
      }
      continue
    }
    if (node.type === 'table') {
      for (const header of node.headers) {
        await primeTableCellMath(header)
      }
      for (const row of node.rows) {
        for (const cell of row.cells) {
          await primeTableCellMath(cell)
        }
      }
    }
  }
}

export const getParsedMessageContent = (
  parsedMessages: readonly ParsedMessage[],
  messageId: string,
): readonly MessageIntermediateNode[] | undefined => {
  const parsedMessage = parsedMessages.find((item) => item.id === messageId)
  return parsedMessage?.parsedContent
}

export const setParsedMessageContent = (
  parsedMessages: readonly ParsedMessage[],
  messageId: string,
  text: string,
  parsedContent: readonly MessageIntermediateNode[],
): readonly ParsedMessage[] => {
  const index = parsedMessages.findIndex((item) => item.id === messageId)
  if (index === -1) {
    return [...parsedMessages, { id: messageId, parsedContent, text }]
  }
  const existingItem = parsedMessages[index]
  if (existingItem.text === text && existingItem.parsedContent === parsedContent) {
    return parsedMessages
  }
  return [...parsedMessages.slice(0, index), { ...existingItem, parsedContent, text }, ...parsedMessages.slice(index + 1)]
}

export const copyParsedMessageContent = (
  parsedMessages: readonly ParsedMessage[],
  sourceMessageId: string,
  targetMessageId: string,
): readonly ParsedMessage[] => {
  const parsedMessage = parsedMessages.find((item) => item.id === sourceMessageId)
  if (!parsedMessage) {
    return parsedMessages
  }
  return setParsedMessageContent(parsedMessages, targetMessageId, parsedMessage.text, parsedMessage.parsedContent)
}

export const parseAndStoreMessageContent = async (
  parsedMessages: readonly ParsedMessage[],
  message: ChatMessage,
): Promise<readonly ParsedMessage[]> => {
  const existingParsedMessage = parsedMessages.find((item) => item.id === message.id)
  if (existingParsedMessage && existingParsedMessage.text === message.text) {
    return parsedMessages
  }
  await Promise.resolve()
  const parsedContent = message.text === '' ? emptyMessageContent : parseMessageContent(message.text)
  await primeMathRenderCache(parsedContent)
  return setParsedMessageContent(parsedMessages, message.id, message.text, parsedContent)
}

export const parseAndStoreMessagesContent = async (
  parsedMessages: readonly ParsedMessage[],
  messages: readonly ChatMessage[],
): Promise<readonly ParsedMessage[]> => {
  let nextParsedMessages = parsedMessages
  for (const message of messages) {
    nextParsedMessages = await parseAndStoreMessageContent(nextParsedMessages, message)
  }
  return nextParsedMessages
}

export const getEmptyMessageContent = (): readonly MessageIntermediateNode[] => {
  return emptyMessageContent
}
