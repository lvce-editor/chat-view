import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getFileNameFromUri } from '../GetFileNameFromUri/GetFileNameFromUri.ts'
import { getReadFileTarget } from '../GetReadFileTarget/GetReadFileTarget.ts'
import { getToolCallFileNameDom } from '../GetToolCallFileNameDom/GetToolCallFileNameDom.ts'
import { getToolCallStatusLabel } from '../GetToolCallStatusLabel/GetToolCallStatusLabel.ts'
import { parseWriteFileLineCounts } from '../ParseWriteFileLineCounts/ParseWriteFileLineCounts.ts'

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

const insertionNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.Insertion,
  type: VirtualDomElements.Span,
}

const deletionNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.Deletion,
  type: VirtualDomElements.Span,
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

export const getToolCallWriteFileVirtualDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  const target = getReadFileTarget(toolCall.arguments)
  if (!target) {
    return []
  }
  const fileName = getFileNameFromUri(target.title)
  const statusLabel = getToolCallStatusLabel(toolCall)
  const showDiffStats = toolCall.status !== 'error' && toolCall.status !== 'not-found'
  const { linesAdded, linesDeleted } = parseWriteFileLineCounts(toolCall.result)
  const childCount = 3 + Number(showDiffStats) * 2 + Number(Boolean(statusLabel))
  const fileNameClickableProps = getFileNameClickableProps(target.clickableUri)
  const diffStatsDom = showDiffStats ? ([insertionNode, text(` +${linesAdded}`), deletionNode, text(` -${linesDeleted}`)] as const) : []
  const statusDom = statusLabel ? [text(statusLabel)] : []
  return [
    {
      childCount,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    fileIconNode,
    toolCallNameNode,
    text('write_file '),
    ...getToolCallFileNameDom(fileName, { clickableProps: fileNameClickableProps }),
    ...diffStatsDom,
    ...statusDom,
  ]
}
