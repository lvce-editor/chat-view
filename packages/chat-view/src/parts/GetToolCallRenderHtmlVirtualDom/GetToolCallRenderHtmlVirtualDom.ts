import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallStatusLabel } from '../GetToolCallStatusLabel/GetToolCallStatusLabel.ts'
import { parseHtmlToVirtualDomWithRootCount } from '../ParseHtmlToVirtualDom/ParseHtmlToVirtualDom.ts'
import { parseRenderHtmlArguments } from '../ParseRenderHtmlArguments/ParseRenderHtmlArguments.ts'

const chatOrderedListItemNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.ChatOrderedListItem,
  type: VirtualDomElements.Li,
}

const chatToolCallRenderHtmlLabelNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.ChatToolCallRenderHtmlLabel,
  type: VirtualDomElements.Div,
}

const toolCallNameNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ToolCallName,
  type: VirtualDomElements.Span,
}

const chatToolCallRenderHtmlContentNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ChatToolCallRenderHtmlContent,
  type: VirtualDomElements.Div,
}

export const getToolCallRenderHtmlVirtualDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  const parsed = parseRenderHtmlArguments(toolCall.arguments)
  if (!parsed) {
    return []
  }

  const statusLabel = getToolCallStatusLabel(toolCall)
  const suffix = `: ${parsed.title}${statusLabel}`
  const parsedHtml = parseHtmlToVirtualDomWithRootCount(parsed.html)
  const { rootChildCount } = parsedHtml

  return [
    chatOrderedListItemNode,
    chatToolCallRenderHtmlLabelNode,
    toolCallNameNode,
    text(toolCall.name),
    text(suffix),
    chatToolCallRenderHtmlContentNode,
    {
      childCount: rootChildCount,
      className: ClassNames.ChatToolCallRenderHtmlBody,
      type: VirtualDomElements.Div,
    },
    ...parsedHtml.virtualDom,
  ]
}
