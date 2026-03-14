import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallArgumentPreview } from '../GetToolCallArgumentPreview/GetToolCallArgumentPreview.ts'
import { getToolCallReadFileVirtualDom } from '../GetToolCallDom/GetToolCallReadFileVirtualDom/GetToolCallReadFileVirtualDom.ts'
import { getToolCallRenderHtmlVirtualDom } from '../GetToolCallRenderHtmlVirtualDom/GetToolCallRenderHtmlVirtualDom.ts'
import { getToolCallStatusLabel } from '../GetToolCallStatusLabel/GetToolCallStatusLabel.ts'

const getToolCallDisplayName = (name: string): string => {
  if (name === 'getWorkspaceUri') {
    return 'get_workspace_uri'
  }
  return name
}

const getToolCallLabel = (toolCall: ChatToolCall): string => {
  const displayName = getToolCallDisplayName(toolCall.name)
  const argumentPreview = getToolCallArgumentPreview(toolCall.arguments)
  const statusLabel = getToolCallStatusLabel(toolCall)
  if (argumentPreview === '{}') {
    return `${displayName}${statusLabel}`
  }
  return `${displayName} ${argumentPreview}${statusLabel}`
}

export const getToolCallDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  if (toolCall.name === 'read_file' || toolCall.name === 'list_files' || toolCall.name === 'list_file') {
    const virtualDom = getToolCallReadFileVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

  if (toolCall.name === 'render_html') {
    const virtualDom = getToolCallRenderHtmlVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

  const label = getToolCallLabel(toolCall)
  return [
    {
      childCount: 1,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    text(label),
  ]
}
