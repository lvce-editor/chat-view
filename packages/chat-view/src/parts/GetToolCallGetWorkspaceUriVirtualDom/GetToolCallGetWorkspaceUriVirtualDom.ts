import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getFileNameFromUri } from '../GetFileNameFromUri/GetFileNameFromUri.ts'
import { getToolCallStatusLabel } from '../GetToolCallStatusLabel/GetToolCallStatusLabel.ts'

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
      title: toolCall.result,
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
    text('get_workspace_uri '),
    {
      childCount: 1,
      className: ClassNames.ChatToolCallReadFileLink,
      ...fileNameClickableProps,
      type: VirtualDomElements.Span,
    },
    {
      childCount: 1,
      className: ClassNames.ChatToolCallFileName,
      ...fileNameClickableProps,
      type: VirtualDomElements.Span,
    },
    text(fileName),
    ...(statusLabel ? [text(statusLabel)] : []),
  ]
}
