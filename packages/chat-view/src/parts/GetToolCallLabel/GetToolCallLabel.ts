import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import { getToolCallArgumentPreview } from '../GetToolCallArgumentPreview/GetToolCallArgumentPreview.ts'
import { getToolCallDisplayName } from '../GetToolCallDisplayName/GetToolCallDisplayName.ts'
import { getToolCallStatusLabel } from '../GetToolCallStatusLabel/GetToolCallStatusLabel.ts'
import { hasIncompleteJsonArguments } from '../HasIncompleteJsonArguments/HasIncompleteJsonArguments.ts'

export const getToolCallLabel = (toolCall: ChatToolCall): string => {
  const displayName = getToolCallDisplayName(toolCall.name)
  if (toolCall.name === 'write_file' && !toolCall.status && hasIncompleteJsonArguments(toolCall.arguments)) {
    return `${displayName} (in progress)`
  }
  if ((toolCall.name === 'list_files' || toolCall.name === 'grep_search') && !toolCall.status && hasIncompleteJsonArguments(toolCall.arguments)) {
    return displayName
  }
  const argumentPreview = getToolCallArgumentPreview(toolCall.arguments)
  const statusLabel = getToolCallStatusLabel(toolCall)
  if (argumentPreview === '{}') {
    return `${displayName}${statusLabel}`
  }
  return `${displayName} ${argumentPreview}${statusLabel}`
}
