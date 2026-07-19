import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getFileNameFromUri } from '../GetFileNameFromUri/GetFileNameFromUri.ts'
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

export const getToolCallGetWorkspaceUriVirtualDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  if (!toolCall.result) {
    return []
  }
  const statusLabel = getToolCallStatusLabel(toolCall)
  const fileName = getFileNameFromUri(toolCall.result)
  const fileNameClickableProps = {
    'data-uri': toolCall.result,
    onClick: DomEventListenerFunctions.HandleClickFileName,
  }
  return [
    {
      childCount: statusLabel ? 4 : 3,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    fileIconNode,
    toolCallNameNode,
    text('get_workspace_uri '),
    ...getToolCallFileNameDom(fileName, { clickableProps: fileNameClickableProps }),
    ...(statusLabel ? [text(statusLabel)] : []),
  ]
}
