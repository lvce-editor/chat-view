import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallArgumentPreview } from '../GetToolCallArgumentPreview/GetToolCallArgumentPreview.ts'

export const getToolCallsDom = (message: ChatMessage): readonly VirtualDomNode[] => {
  if (message.role !== 'assistant' || !message.toolCalls || message.toolCalls.length === 0) {
    return []
  }
  return message.toolCalls.flatMap((toolCall) => {
    const argumentPreview = getToolCallArgumentPreview(toolCall.arguments)
    const label = `${toolCall.name} ${argumentPreview}`
    return [
      {
        childCount: 1,
        className: ClassNames.Markdown,
        type: VirtualDomElements.P,
      },
      text(label),
    ]
  })
}
