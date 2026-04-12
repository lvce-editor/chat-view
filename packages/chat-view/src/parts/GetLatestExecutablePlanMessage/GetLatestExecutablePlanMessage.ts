import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'

const hasFailedToolCall = (message: ChatMessage): boolean => {
  return (message.toolCalls || []).some((toolCall) => toolCall.status === 'error' || toolCall.status === 'not-found')
}

export const isExecutablePlanMessage = (message: ChatMessage): boolean => {
  return (
    message.role === 'assistant' && message.agentMode === 'plan' && !message.inProgress && message.text.trim() !== '' && !hasFailedToolCall(message)
  )
}

export const getLatestExecutablePlanMessage = (session: ChatSession | undefined): ChatMessage | undefined => {
  if (!session) {
    return undefined
  }
  for (let index = session.messages.length - 1; index >= 0; index--) {
    const message = session.messages[index]
    if (message.role !== 'assistant') {
      continue
    }
    return isExecutablePlanMessage(message) ? message : undefined
  }
  return undefined
}
