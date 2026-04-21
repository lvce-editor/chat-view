import { ChatMessageParsingWorker } from '@lvce-editor/rpc-registry'
import { isObject } from '../IsObject/IsObject.ts'
import type { ParsedMessage } from '../ViewModel/ViewModel.ts'

const emptyMessageContent: readonly unknown[] = [
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

interface MessageLike {
  readonly id: string
  readonly text: string
}

const isMessageLike = (value: unknown): value is MessageLike => {
  return isObject(value) && typeof value.id === 'string' && typeof value.text === 'string'
}

export const setParsedMessageContent = (
  parsedMessages: readonly ParsedMessage[],
  messageId: string,
  text: string,
  parsedContent: readonly unknown[],
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

const getMessagesNeedingParsing = (parsedMessages: readonly ParsedMessage[], messages: readonly MessageLike[]): readonly MessageLike[] => {
  return messages.filter((message) => {
    const existingParsedMessage = parsedMessages.find((item) => item.id === message.id)
    return !existingParsedMessage || existingParsedMessage.text !== message.text
  })
}

export const parseAndStoreMessagesContent = async (
  parsedMessages: readonly ParsedMessage[],
  messages: readonly unknown[],
): Promise<readonly ParsedMessage[]> => {
  const typedMessages = messages.filter(isMessageLike)
  const messagesNeedingParsing = getMessagesNeedingParsing(parsedMessages, typedMessages)
  if (messagesNeedingParsing.length === 0) {
    return parsedMessages
  }
  const parsedContents = (await ChatMessageParsingWorker.invoke(
    'ChatMessageParsing.parseMessageContents',
    messagesNeedingParsing.map((message) => message.text),
  )) as readonly (readonly unknown[])[]
  let nextParsedMessages = parsedMessages
  for (const [index, message] of messagesNeedingParsing.entries()) {
    const parsedContent = message.text === '' ? emptyMessageContent : parsedContents[index]
    nextParsedMessages = setParsedMessageContent(nextParsedMessages, message.id, message.text, parsedContent)
  }
  return nextParsedMessages
}