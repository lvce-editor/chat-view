import { VirtualDomElements } from '@lvce-editor/constants'
import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallDom } from '../GetToolCallDom/GetToolCallDom.ts'

export const getToolCallsDom = (message: ChatMessage): readonly VirtualDomNode[] => {
  if (message.role !== 'assistant' || !message.toolCalls || message.toolCalls.length === 0) {
    return []
  }

  return [
    {
      childCount: message.toolCalls.length,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    ...message.toolCalls.flatMap(getToolCallDom),
  ]
}
