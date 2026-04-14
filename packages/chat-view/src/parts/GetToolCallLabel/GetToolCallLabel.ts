import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import { getFileNameFromUri } from '../GetFileNameFromUri/GetFileNameFromUri.ts'
import { getRenameTargets } from '../GetRenameTargets/GetRenameTargets.ts'
import { getToolCallArgumentPreview } from '../GetToolCallArgumentPreview/GetToolCallArgumentPreview.ts'
import { getToolCallDisplayName } from '../GetToolCallDisplayName/GetToolCallDisplayName.ts'
import { getToolCallStatusLabel } from '../GetToolCallStatusLabel/GetToolCallStatusLabel.ts'
import { hasIncompleteJsonArguments } from '../HasIncompleteJsonArguments/HasIncompleteJsonArguments.ts'

export const getToolCallLabel = (toolCall: ChatToolCall): string => {
  const displayName = getToolCallDisplayName(toolCall.name)
  if (toolCall.name === 'write_file' && !toolCall.status && hasIncompleteJsonArguments(toolCall.arguments)) {
    return `${displayName} (in progress)`
  }
  if (
    (toolCall.name === 'list_files' || toolCall.name === 'grep_search' || toolCall.name === 'glob' || toolCall.name === 'rename') &&
    !toolCall.status &&
    hasIncompleteJsonArguments(toolCall.arguments)
  ) {
    return displayName
  }
  if (toolCall.name === 'rename') {
    const renameTargets = getRenameTargets(toolCall.arguments)
    if (renameTargets) {
      const fromFileName = getFileNameFromUri(renameTargets.from.title)
      const toFileName = getFileNameFromUri(renameTargets.to.title)
      const statusLabel = getToolCallStatusLabel(toolCall)
      return `${displayName} ${fromFileName} -> ${toFileName}${statusLabel}`
    }
  }
  const argumentPreview = getToolCallArgumentPreview(toolCall.arguments)
  const statusLabel = getToolCallStatusLabel(toolCall)
  if (argumentPreview === '{}') {
    return `${displayName}${statusLabel}`
  }
  return `${displayName} ${argumentPreview}${statusLabel}`
}
