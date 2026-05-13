import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'

export const getToolCallStatusLabel = (toolCall: ChatToolCall): string => {
  if (toolCall.status === 'success') {
    return ''
  }
  if (toolCall.status === 'in-progress') {
    return ' (in progress)'
  }
  if (toolCall.status === 'canceled') {
    return ' (canceled)'
  }
  if (toolCall.status === 'not-found') {
    if (toolCall.errorMessage) {
      return ` (error: ${toolCall.errorMessage})`
    }
    return ' (not-found)'
  }
  if (toolCall.status === 'error') {
    if (toolCall.errorMessage) {
      return ` (error: ${toolCall.errorMessage})`
    }
    return ' (error)'
  }
  return ''
}
