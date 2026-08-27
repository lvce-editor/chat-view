import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getFileNameFromUri } from '../GetFileNameFromUri/GetFileNameFromUri.ts'
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

export const getToolCallCreateDirectoryVirtualDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  const target = getReadFileTarget(toolCall.arguments)
  if (!target) {
    return []
  }
  const directoryName = getFileNameFromUri(target.title)
  const statusLabel = getToolCallStatusLabel(toolCall)
  const fileNameClickableProps = target.clickableUri
    ? {
        'data-uri': target.clickableUri,
        onClick: DomEventListenerFunctions.HandleClickFileName,
      }
    : {}
  const statusDom = statusLabel ? [text(statusLabel)] : []
  return [
    {
      childCount: statusLabel ? 4 : 3,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    fileIconNode,
    toolCallNameNode,
    text('create_directory '),
    ...getToolCallFileNameDom(directoryName, { clickableProps: fileNameClickableProps }),
    ...statusDom,
  ]
}
