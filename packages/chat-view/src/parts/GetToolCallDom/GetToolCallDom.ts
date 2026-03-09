import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallArgumentPreview } from '../GetToolCallArgumentPreview/GetToolCallArgumentPreview.ts'
import { getToolCallReadFileVirtualDom } from './GetToolCallReadFileVirtualDom.ts'

export const getToolCallDom = (toolCall: { readonly name: string; readonly arguments: string }): readonly VirtualDomNode[] => {
  if (toolCall.name === 'read_file') {
    const virtualDom = getToolCallReadFileVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

  const argumentPreview = getToolCallArgumentPreview(toolCall.arguments)
  const label = `${toolCall.name} ${argumentPreview}`
  return [
    {
      childCount: 1,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    text(label),
  ]
}
