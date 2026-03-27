import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallLabel } from '../GetToolCallLabel/GetToolCallLabel.ts'

const RE_TOOL_NAME_PREFIX = /^([^ :]+)/

export const getToolCallDefaultDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  const label = getToolCallLabel(toolCall)
  const match = RE_TOOL_NAME_PREFIX.exec(label)
  const toolNamePrefix = match ? match[1] : label
  const suffix = label.slice(toolNamePrefix.length)
  const hasSuffix = suffix.length > 0
  const hoverTitle = hasSuffix && toolCall.arguments.trim() ? toolCall.arguments : undefined
  return [
    {
      childCount: hasSuffix ? 2 : 1,
      className: ClassNames.ChatOrderedListItem,
      ...(hoverTitle ? { title: hoverTitle } : {}),
      type: VirtualDomElements.Li,
    },
    {
      childCount: 1,
      className: ClassNames.ToolCallName,
      type: VirtualDomElements.Span,
    },
    text(toolNamePrefix),
    ...(hasSuffix ? [text(suffix)] : []),
  ]
}
