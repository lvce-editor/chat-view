import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getFileNameFromUri } from '../GetFileNameFromUri/GetFileNameFromUri.ts'
import { getToolCallArgumentPreview } from '../GetToolCallArgumentPreview/GetToolCallArgumentPreview.ts'
import { getToolCallReadFileVirtualDom } from '../GetToolCallReadFileVirtualDom/GetToolCallReadFileVirtualDom.ts'
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

const getToolCallGetWorkspaceUriVirtualDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  if (!toolCall.result) {
    return []
  }
  const statusLabel = getToolCallStatusLabel(toolCall)
  const fileName = getFileNameFromUri(toolCall.result)
  return [
    {
      childCount: statusLabel ? 4 : 3,
      className: ClassNames.ChatOrderedListItem,
      title: toolCall.result,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 0,
      className: ClassNames.FileIcon,
      type: VirtualDomElements.Div,
    },
    text('get_workspace_uri '),
    {
      childCount: 1,
      className: ClassNames.ChatToolCallReadFileLink,
      'data-uri': toolCall.result,
      onClick: DomEventListenerFunctions.HandleClickReadFile,
      type: VirtualDomElements.Span,
    },
    text(fileName),
    ...(statusLabel ? [text(statusLabel)] : []),
  ]
}

export const getToolCallDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  if (toolCall.name === 'getWorkspaceUri') {
    const virtualDom = getToolCallGetWorkspaceUriVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

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
