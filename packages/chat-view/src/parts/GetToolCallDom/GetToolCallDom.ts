import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallArgumentPreview } from '../GetToolCallArgumentPreview/GetToolCallArgumentPreview.ts'
import { getToolCallReadFileVirtualDom } from './GetToolCallReadFileVirtualDom.ts'
import { getToolCallRenderHtmlVirtualDom } from './GetToolCallRenderHtmlVirtualDom.ts'
import { getToolCallStatusLabel } from './GetToolCallStatusLabel.ts'

export const getToolCallDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  if (toolCall.name === 'read_file') {
    const virtualDom = getToolCallReadFileVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

  if (toolCall.name === 'render_html') {
    const virtualDom = getToolCallRenderHtmlVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

  const argumentPreview = getToolCallArgumentPreview(toolCall.arguments)
  const label = `${toolCall.name} ${argumentPreview}${getToolCallStatusLabel(toolCall)}`
  return [
    {
      childCount: 1,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    text(label),
  ]
}
