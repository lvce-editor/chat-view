import { VirtualDomElements } from '@lvce-editor/constants'
import { text, type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallDom } from '../GetToolCallDom2/GetToolCallDom.ts'

export const getToolCallsDom = (message: ChatMessage): readonly VirtualDomNode[] => {
  if (message.role !== 'assistant' || !message.toolCalls || message.toolCalls.length === 0) {
    return []
  }

  return [
    {
      childCount: 2,
      className: ClassNames.ChatToolCalls,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatToolCallsLabel,
      type: VirtualDomElements.Div,
    },
    text('tools'),
    {
      childCount: message.toolCalls.length,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    ...message.toolCalls.flatMap(getToolCallDom),
  ]
}
