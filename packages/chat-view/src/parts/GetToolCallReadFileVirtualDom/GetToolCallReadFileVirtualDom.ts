import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getFileNameFromUri } from '../GetFileNameFromUri/GetFileNameFromUri.ts'
import { getGlobMatchCount } from '../GetGlobMatchCount/GetGlobMatchCount.ts'
import { getReadFileTarget } from '../GetReadFileTarget/GetReadFileTarget.ts'
import { getToolCallFileNameDom } from '../GetToolCallFileNameDom/GetToolCallFileNameDom.ts'
import { getToolCallStatusLabel } from '../GetToolCallStatusLabel/GetToolCallStatusLabel.ts'

const getGlobPatternLabel = (toolCall: ChatToolCall): string => {
  if (toolCall.name !== 'glob') {
    return ''
  }
  try {
    const parsed = JSON.parse(toolCall.arguments)
    if (!parsed || typeof parsed !== 'object') {
      return ''
    }
    const pattern = Reflect.get(parsed, 'pattern')
    return typeof pattern === 'string' && pattern ? ` "${pattern}"` : ''
  } catch {
    return ''
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
  const globMatchLabel = typeof globMatchCount === 'number' ? `, ${globMatchCount} ${globMatchCount === 1 ? 'match' : 'matches'}` : ''
  const fileNameClickableProps = target.clickableUri
    ? {
        'data-uri': target.clickableUri,
        onClick: DomEventListenerFunctions.HandleClickFileName,
      }
    : {}
  return [
    {
      childCount: 3 + (globPatternLabel ? 1 : 0) + (globMatchLabel ? 1 : 0) + (statusLabel ? 1 : 0),
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 0,
      className: ClassNames.FileIcon,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ToolCallName,
      type: VirtualDomElements.Span,
    },
    text(toolNameLabel),
    ...getToolCallFileNameDom(fileName, { clickableProps: fileNameClickableProps, title: target.title }),
    ...(globPatternLabel ? [text(globPatternLabel)] : []),
    ...(globMatchLabel ? [text(globMatchLabel)] : []),
    ...(statusLabel ? [text(statusLabel)] : []),
  ]
}
