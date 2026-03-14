import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import { parseMessageContent } from '../ParseMessageContent/ParseMessageContent.ts'

const parsedMessageContentByMessage = new WeakMap<ChatMessage, readonly MessageIntermediateNode[]>()

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

export const getParsedMessageContent = (message: ChatMessage): readonly MessageIntermediateNode[] | undefined => {
  return parsedMessageContentByMessage.get(message)
}

export const setParsedMessageContent = (message: ChatMessage, value: readonly MessageIntermediateNode[]): void => {
  parsedMessageContentByMessage.set(message, value)
}

export const copyParsedMessageContent = (source: ChatMessage, target: ChatMessage): void => {
  const parsed = parsedMessageContentByMessage.get(source)
  if (!parsed) {
    return
  }
  parsedMessageContentByMessage.set(target, parsed)
}

export const parseAndStoreMessageContent = async (message: ChatMessage): Promise<void> => {
  if (parsedMessageContentByMessage.has(message)) {
    return
  }
  await Promise.resolve()
  parsedMessageContentByMessage.set(message, message.text === '' ? emptyMessageContent : parseMessageContent(message.text))
}

export const parseAndStoreMessagesContent = async (messages: readonly ChatMessage[]): Promise<void> => {
  await Promise.all(messages.map(parseAndStoreMessageContent))
}

export const getEmptyMessageContent = (): readonly MessageIntermediateNode[] => {
  return emptyMessageContent
}
