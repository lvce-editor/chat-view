import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getFileNameFromUri } from '../GetFileNameFromUri/GetFileNameFromUri.ts'
import { getReadFileTarget } from '../GetReadFileTarget/GetReadFileTarget.ts'
import { getToolCallArgumentPreview } from '../GetToolCallArgumentPreview/GetToolCallArgumentPreview.ts'
import { getToolCallAskQuestionVirtualDom } from '../GetToolCallAskQuestionVirtualDom/GetToolCallAskQuestionVirtualDom.ts'
import { getToolCallReadFileVirtualDom } from '../GetToolCallReadFileVirtualDom/GetToolCallReadFileVirtualDom.ts'
import { getToolCallRenderHtmlVirtualDom } from '../GetToolCallRenderHtmlVirtualDom/GetToolCallRenderHtmlVirtualDom.ts'
import { getToolCallStatusLabel } from '../GetToolCallStatusLabel/GetToolCallStatusLabel.ts'

const getToolCallDisplayName = (name: string): string => {
  if (name === 'getWorkspaceUri') {
    return 'get_workspace_uri'
  }
  return name
}

const hasIncompleteJsonArguments = (rawArguments: string): boolean => {
  try {
    JSON.parse(rawArguments)
    return false
  } catch {
    return true
  }
}

const getToolCallLabel = (toolCall: ChatToolCall): string => {
  const displayName = getToolCallDisplayName(toolCall.name)
  if (toolCall.name === 'write_file' && !toolCall.status && hasIncompleteJsonArguments(toolCall.arguments)) {
    return `${displayName} (in progress)`
  }
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

const parseWriteFileLineCounts = (rawResult: string | undefined): { readonly linesAdded: number; readonly linesDeleted: number } => {
  if (!rawResult) {
    return {
      linesAdded: 0,
      linesDeleted: 0,
    }
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(rawResult)
  } catch {
    return {
      linesAdded: 0,
      linesDeleted: 0,
    }
  }
  if (!parsed || typeof parsed !== 'object') {
    return {
      linesAdded: 0,
      linesDeleted: 0,
    }
  }
  const linesAdded = Reflect.get(parsed, 'linesAdded')
  const linesDeleted = Reflect.get(parsed, 'linesDeleted')
  return {
    linesAdded: typeof linesAdded === 'number' ? Math.max(0, linesAdded) : 0,
    linesDeleted: typeof linesDeleted === 'number' ? Math.max(0, linesDeleted) : 0,
  }
}

const getToolCallWriteFileVirtualDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  const target = getReadFileTarget(toolCall.arguments)
  if (!target) {
    return []
  }
  const fileName = getFileNameFromUri(target.title)
  const statusLabel = getToolCallStatusLabel(toolCall)
  const { linesAdded, linesDeleted } = parseWriteFileLineCounts(toolCall.result)
  const fileNameClickableProps = target.clickableUri
    ? {
        'data-uri': target.clickableUri,
        onClick: DomEventListenerFunctions.HandleClickReadFile,
      }
    : {}
  return [
    {
      childCount: statusLabel ? 6 : 5,
      className: ClassNames.ChatOrderedListItem,
      title: target.title,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 0,
      className: ClassNames.FileIcon,
      type: VirtualDomElements.Div,
    },
    text('write_file '),
    {
      childCount: 1,
      className: ClassNames.ChatToolCallReadFileLink,
      ...fileNameClickableProps,
      type: VirtualDomElements.Span,
    },
    text(fileName),
    {
      childCount: 1,
      className: ClassNames.Insertion,
      type: VirtualDomElements.Span,
    },
    text(` +${linesAdded}`),
    {
      childCount: 1,
      className: ClassNames.Deletion,
      type: VirtualDomElements.Span,
    },
    text(` -${linesDeleted}`),
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

  if (toolCall.name === 'write_file') {
    const virtualDom = getToolCallWriteFileVirtualDom(toolCall)
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

  if (toolCall.name === 'ask_question') {
    const virtualDom = getToolCallAskQuestionVirtualDom(toolCall)
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
