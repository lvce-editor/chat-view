import type { ChatMessage, ChatMessageContentPart } from '../ChatMessage/ChatMessage.ts'
import { isAgentMode } from '../AgentMode/AgentMode.ts'
import { isObject } from '../IsObject/IsObject.ts'

interface NormalizeStoredChatMessageOptions {
  readonly fallbackId?: string
  readonly fallbackTime?: string
}

const getMessageRole = (value: unknown): ChatMessage['role'] | undefined => {
  if (value === 'assistant' || value === 'user') {
    return value
  }
  return undefined
}

const getMessageContentParts = (value: unknown): readonly ChatMessageContentPart[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined
  }
  const parts: ChatMessageContentPart[] = []
  for (const part of value) {
    if (!isObject(part)) {
      continue
    }
    parts.push({ ...part })
  }
  return parts
}

export const getMessageTextFromContent = (value: unknown): string => {
  if (typeof value === 'string') {
    return value
  }
  if (!Array.isArray(value)) {
    return ''
  }
  return value
    .map((part) => {
      if (!isObject(part)) {
        return ''
      }
      return typeof part.text === 'string' ? part.text : ''
    })
    .join('')
}

export const normalizeStoredChatMessage = (value: unknown, options: Readonly<NormalizeStoredChatMessageOptions> = {}): ChatMessage | undefined => {
  if (!isObject(value)) {
    return undefined
  }
  const id = typeof value.id === 'string' ? value.id : options.fallbackId
  const time = typeof value.time === 'string' ? value.time : options.fallbackTime
  const role = getMessageRole(value.role)
  if (!id || !time || !role) {
    return undefined
  }
  const content = getMessageContentParts(value.content)
  const derivedText = getMessageTextFromContent(value.content)
  const text = derivedText || (typeof value.text === 'string' ? value.text : '')
  const agentMode = typeof value.agentMode === 'string' && isAgentMode(value.agentMode) ? value.agentMode : undefined
  const attachments = Array.isArray(value.attachments) ? value.attachments : undefined
  const inProgress = typeof value.inProgress === 'boolean' ? value.inProgress : undefined
  const toolCalls = Array.isArray(value.toolCalls) ? value.toolCalls : undefined
  return {
    ...(agentMode && {
      agentMode,
    }),
    ...(attachments && {
      attachments,
    }),
    ...(content && {
      content,
    }),
    id,
    ...(inProgress !== undefined && {
      inProgress,
    }),
    role,
    text,
    time,
    ...(toolCalls && {
      toolCalls,
    }),
  }
}

export const normalizeStoredChatMessages = (messages: readonly unknown[]): readonly ChatMessage[] => {
  return messages.map((message) => normalizeStoredChatMessage(message)).filter((message) => !!message)
}
