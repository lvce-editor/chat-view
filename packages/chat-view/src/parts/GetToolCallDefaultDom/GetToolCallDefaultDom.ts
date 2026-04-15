import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallLabel } from '../GetToolCallLabel/GetToolCallLabel.ts'

const RE_TOOL_NAME_PREFIX = /^([^ :]+)/

const getGrepSearchPreviewText = (result: string): string => {
  if (!result.trim()) {
    return result
  }
  try {
    const parsed = JSON.parse(result) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return typeof parsed === 'string' ? parsed : JSON.stringify(parsed)
    }
    const nestedResult = Reflect.get(parsed, 'result')
    if (nestedResult === undefined) {
      return JSON.stringify(parsed)
    }
    return typeof nestedResult === 'string' ? nestedResult : JSON.stringify(nestedResult)
  } catch {
    return result
  }
}

const getHoverTitle = (toolCall: ChatToolCall): string | undefined => {
  const trimmedArguments = toolCall.arguments.trim()
  if (!trimmedArguments) {
    return undefined
  }
  if (toolCall.name !== 'grep_search') {
    return toolCall.arguments
  }
  try {
    const parsed = JSON.parse(toolCall.arguments) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return toolCall.arguments
    }
    const nestedArguments = Reflect.get(parsed, 'arguments')
    if (nestedArguments === undefined) {
      return toolCall.arguments
    }
    if (typeof nestedArguments === 'string') {
      return nestedArguments
    }
    return JSON.stringify(nestedArguments)
  } catch {
    return toolCall.arguments
  }
}

export const getToolCallDefaultDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  if (toolCall.name === 'grep_search' && toolCall.result) {
    return [
      {
        childCount: 1,
        className: ClassNames.ChatOrderedListItem,
        type: VirtualDomElements.Li,
      },
      text(getGrepSearchPreviewText(toolCall.result)),
    ]
  }

  const label = getToolCallLabel(toolCall)
  const match = RE_TOOL_NAME_PREFIX.exec(label)
  const toolNamePrefix = match ? match[1] : label
  const suffix = label.slice(toolNamePrefix.length)
  const hasSuffix = suffix.length > 0
  const hoverTitle = hasSuffix ? getHoverTitle(toolCall) : undefined
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
