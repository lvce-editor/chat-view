import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'

export const getToolCallMergeKey = (toolCall: StreamingToolCall): string => {
  if (toolCall.id) {
    return `id:${toolCall.id}`
  }
  return `value:${toolCall.name}:${toolCall.arguments}`
}
