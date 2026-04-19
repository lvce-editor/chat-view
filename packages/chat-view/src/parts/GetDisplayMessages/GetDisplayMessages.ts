import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import { getEmptyMessageContent, getParsedMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'

export interface DisplayMessage {
  readonly message: ChatMessage
  readonly parsedContent: readonly MessageIntermediateNode[]
  readonly standaloneImageAttachment?: ComposerAttachment
}

const hasMessageText = (message: ChatMessage): boolean => {
  return message.text.trim().length > 0
}

const isImageAttachment = (attachment: ComposerAttachment): boolean => {
  return attachment.displayType === 'image'
}

const withAttachments = (message: ChatMessage, attachments: readonly ComposerAttachment[]): ChatMessage => {
  const { attachments: _attachments, ...messageWithoutAttachments } = message
  if (attachments.length === 0) {
    return messageWithoutAttachments
  }
  return {
    ...messageWithoutAttachments,
    attachments,
  }
}

export const getDisplayMessages = (messages: readonly ChatMessage[], parsedMessages: readonly ParsedMessage[]): readonly DisplayMessage[] => {
  const displayMessages: DisplayMessage[] = []
  for (const message of messages) {
    const parsedContent = getParsedMessageContent(parsedMessages, message.id)
    if (!parsedContent) {
      continue
    }
    if (message.role === 'user') {
      const attachments = message.attachments ?? []
      const imageAttachments = attachments.filter(isImageAttachment)
      if (imageAttachments.length > 0) {
        const nonImageAttachments = attachments.filter((attachment) => !isImageAttachment(attachment))
        if (hasMessageText(message) || nonImageAttachments.length > 0) {
          displayMessages.push({
            message: withAttachments(message, nonImageAttachments),
            parsedContent: hasMessageText(message) ? parsedContent : getEmptyMessageContent(),
          })
        }
        for (const attachment of imageAttachments) {
          displayMessages.push({
            message: {
              ...withAttachments(message, [attachment]),
              text: '',
            },
            parsedContent: getEmptyMessageContent(),
            standaloneImageAttachment: attachment,
          })
        }
        continue
      }
    }
    if (message.role !== 'assistant' || !message.toolCalls || message.toolCalls.length === 0) {
      displayMessages.push({
        message,
        parsedContent,
      })
      continue
    }
    const toolCallMessage: ChatMessage = {
      ...message,
      text: '',
    }
    displayMessages.push({
      message: toolCallMessage,
      parsedContent: getEmptyMessageContent(),
    })
    if (hasMessageText(message)) {
      const { toolCalls: _toolCalls, ...messageWithoutToolCalls } = message
      const textMessage: ChatMessage = {
        ...messageWithoutToolCalls,
      }
      displayMessages.push({
        message: textMessage,
        parsedContent,
      })
    }
  }
  return displayMessages
}
