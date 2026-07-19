import { VirtualDomElements } from '@lvce-editor/constants'
import { text, type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallDom } from '../GetToolCallDom/GetToolCallDom.ts'

const chatOrderedListMarkerNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ChatOrderedListMarker,
  type: VirtualDomElements.Span,
}

const chatToolCallsNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.ChatToolCalls,
  type: VirtualDomElements.Div,
}

const chatToolCallsLabelNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ChatToolCallsLabel,
  type: VirtualDomElements.Div,
}

const withOrderedListMarker = (virtualDom: readonly VirtualDomNode[], index: number): readonly VirtualDomNode[] => {
  const [listItem, ...children] = virtualDom
  if (!listItem) {
    return virtualDom
  }
  return [
    {
      ...listItem,
      childCount: 2,
    },
    chatOrderedListMarkerNode,
    text(`${index}.`),
    {
      childCount: listItem.childCount || 0,
      className: ClassNames.ChatOrderedListItemContent,
      type: VirtualDomElements.Div,
    },
    ...children,
  ]
}

export const getToolCallsDom = (message: ChatMessage): readonly VirtualDomNode[] => {
  if (message.role !== 'assistant' || !message.toolCalls || message.toolCalls.length === 0) {
    return []
  }

  return [
    chatToolCallsNode,
    chatToolCallsLabelNode,
    text('tools'),
    {
      childCount: message.toolCalls.length,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    ...message.toolCalls.flatMap((toolCall, index) => withOrderedListMarker(getToolCallDom(toolCall), index + 1)),
  ]
}
