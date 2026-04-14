import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getFileNameFromUri } from '../GetFileNameFromUri/GetFileNameFromUri.ts'
import { getRenameTargets } from '../GetRenameTargets/GetRenameTargets.ts'
import { getToolCallFileNameDom } from '../GetToolCallFileNameDom/GetToolCallFileNameDom.ts'
import { getToolCallStatusLabel } from '../GetToolCallStatusLabel/GetToolCallStatusLabel.ts'

export const getToolCallRenameVirtualDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  const targets = getRenameTargets(toolCall.arguments)
  if (!targets) {
    return []
  }
  const fromFileName = getFileNameFromUri(targets.from.title)
  const toFileName = getFileNameFromUri(targets.to.title)
  const fromClickableProps = {
    'data-uri': targets.from.clickableUri,
    onClick: DomEventListenerFunctions.HandleClickFileName,
  }
  const toClickableProps = {
    'data-uri': targets.to.clickableUri,
    onClick: DomEventListenerFunctions.HandleClickFileName,
  }
  const statusLabel = getToolCallStatusLabel(toolCall)
  return [
    {
      childCount: statusLabel ? 6 : 5,
      className: ClassNames.ChatOrderedListItem,
      title: `${targets.from.title} -> ${targets.to.title}`,
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
    text('rename '),
    ...getToolCallFileNameDom(fromFileName, { clickableProps: fromClickableProps, title: targets.from.title }),
    text(' -> '),
    ...getToolCallFileNameDom(toFileName, { clickableProps: toClickableProps, title: targets.to.title }),
    ...(statusLabel ? [text(statusLabel)] : []),
  ]
}
