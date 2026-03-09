import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getFileNameFromUri } from './GetFileNameFromUri.ts'
import { getReadFileTarget } from './GetReadFileTarget.ts'

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

export const getToolCallReadFileVirtualDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  const target = getReadFileTarget(toolCall.arguments)
  if (!target) {
    return []
  }
  const fileName = getFileNameFromUri(target.title)
  const toolNameLabel = `${toolCall.name} `
  const statusLabel = getToolCallStatusLabel(toolCall)
  const clickableProps = target.clickableUri
    ? {
        'data-uri': target.clickableUri,
        onClick: DomEventListenerFunctions.HandleClickReadFile,
      }
    : {}
  const fileNameClickableProps = target.clickableUri
    ? {
        'data-uri': target.clickableUri,
        onClick: DomEventListenerFunctions.HandleClickReadFile,
      }
    : {}
  return [
    {
      childCount: statusLabel ? 4 : 3,
      className: ClassNames.ChatOrderedListItem,
      ...clickableProps,
      title: target.title,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 0,
      className: ClassNames.FileIcon,
      ...clickableProps,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      ...fileNameClickableProps,
      style: 'color: var(--vscode-textLink-foreground); text-decoration: underline;',
      type: VirtualDomElements.Span,
    },
    text(toolNameLabel),
    text(fileName),
    ...(statusLabel
      ? [
          text(statusLabel),
        ]
      : []),
  ]
}
