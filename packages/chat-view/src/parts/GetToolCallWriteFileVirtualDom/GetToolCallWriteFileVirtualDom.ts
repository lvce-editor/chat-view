import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getFileNameFromUri } from '../GetFileNameFromUri/GetFileNameFromUri.ts'
import { getReadFileTarget } from '../GetReadFileTarget/GetReadFileTarget.ts'
import { getToolCallStatusLabel } from '../GetToolCallStatusLabel/GetToolCallStatusLabel.ts'
import { parseWriteFileLineCounts } from '../ParseWriteFileLineCounts/ParseWriteFileLineCounts.ts'

export const getToolCallWriteFileVirtualDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
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
    {
      childCount: 1,
      className: ClassNames.ChatToolCallFileName,
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
