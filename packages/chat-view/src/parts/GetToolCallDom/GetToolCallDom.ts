import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallArgumentPreview } from '../GetToolCallArgumentPreview/GetToolCallArgumentPreview.ts'
import { getToolCallReadFileVirtualDom } from './GetToolCallReadFileVirtualDom.ts'

const getToolCallStatusLabel = (toolCall: ChatToolCall): string => {
  if (toolCall.status === 'not-found') {
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

export const getToolCallDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  if (toolCall.name === 'read_file') {
    const virtualDom = getToolCallReadFileVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

  const argumentPreview = getToolCallArgumentPreview(toolCall.arguments)
  const label = `${toolCall.name} ${argumentPreview}${getToolCallStatusLabel(toolCall)}`
  return [
    {
      childCount: 1,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    text(label),
  ]
}
