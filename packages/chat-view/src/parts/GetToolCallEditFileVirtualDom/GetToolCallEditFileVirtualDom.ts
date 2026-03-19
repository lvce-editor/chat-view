import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getFileNameFromUri } from '../GetFileNameFromUri/GetFileNameFromUri.ts'
import { getReadFileTarget } from '../GetReadFileTarget/GetReadFileTarget.ts'

export const getToolCallEditFileVirtualDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  const target = getReadFileTarget(toolCall.arguments)
  if (!target) {
    return []
  }
  const fileName = getFileNameFromUri(target.title)
  const fileNameClickableProps = target.clickableUri
    ? {
        'data-uri': target.clickableUri,
        onClick: DomEventListenerFunctions.HandleClickFileName,
      }
    : {}
  return [
    {
      childCount: 3,
      className: ClassNames.ChatOrderedListItem,
      title: target.title,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 0,
      className: ClassNames.FileIcon,
      type: VirtualDomElements.Div,
    },
    text('edit_file '),
    {
      childCount: 1,
      className: ClassNames.ChatToolCallReadFileLink,
      title: target.clickableUri,
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
  ]
}
