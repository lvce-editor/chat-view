import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getFileNameFromUri } from '../GetFileNameFromUri/GetFileNameFromUri.ts'
import { getGlobMatchCount } from '../GetGlobMatchCount/GetGlobMatchCount.ts'
import { getObjectProperty } from '../GetObjectProperty/GetObjectProperty.ts'
import { getReadFileTarget } from '../GetReadFileTarget/GetReadFileTarget.ts'
import { getToolCallFileNameDom } from '../GetToolCallFileNameDom/GetToolCallFileNameDom.ts'
import { getToolCallStatusLabel } from '../GetToolCallStatusLabel/GetToolCallStatusLabel.ts'

const fileIconNode: VirtualDomNode = {
  childCount: 0,
  className: ClassNames.FileIcon,
  type: VirtualDomElements.Div,
}

const toolCallNameNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ToolCallName,
  type: VirtualDomElements.Span,
}

const getGlobPatternLabel = (toolCall: ChatToolCall): string => {
  if (toolCall.name !== 'glob') {
    return ''
  }
  try {
    const parsed = JSON.parse(toolCall.arguments)
    if (!parsed || typeof parsed !== 'object') {
      return ''
    }
    const pattern = getObjectProperty(parsed, 'pattern')
    return typeof pattern === 'string' && pattern ? ` "${pattern}"` : ''
  } catch {
    return ''
  }
}

const getFileNameClickableProps = (clickableUri: string): Record<string, unknown> => {
  if (!clickableUri) {
    return {}
  }
  return {
    'data-uri': clickableUri,
    onClick: DomEventListenerFunctions.HandleClickFileName,
  }
}

export const getToolCallReadFileVirtualDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  const target = getReadFileTarget(toolCall.arguments)
  if (!target) {
    return []
  }
  const fileName = getFileNameFromUri(target.title)
  const toolNameLabel = `${toolCall.name} `
  const statusLabel = getToolCallStatusLabel(toolCall)
  const globPatternLabel = getGlobPatternLabel(toolCall)
  const globMatchCount = toolCall.name === 'glob' && toolCall.status === 'success' ? getGlobMatchCount(toolCall.result) : undefined
  let globMatchLabel = ''
  if (typeof globMatchCount === 'number') {
    const globMatchWord = globMatchCount === 1 ? 'match' : 'matches'
    globMatchLabel = `, ${globMatchCount} ${globMatchWord}`
  }
  const childCount = 3 + Number(Boolean(globPatternLabel)) + Number(Boolean(globMatchLabel)) + Number(Boolean(statusLabel))
  const fileNameClickableProps = getFileNameClickableProps(target.clickableUri)
  const globPatternDom = globPatternLabel ? [text(globPatternLabel)] : []
  const globMatchDom = globMatchLabel ? [text(globMatchLabel)] : []
  const statusDom = statusLabel ? [text(statusLabel)] : []
  return [
    {
      childCount,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    fileIconNode,
    toolCallNameNode,
    text(toolNameLabel),
    ...getToolCallFileNameDom(fileName, { clickableProps: fileNameClickableProps, title: target.title }),
    ...globPatternDom,
    ...globMatchDom,
    ...statusDom,
  ]
}
