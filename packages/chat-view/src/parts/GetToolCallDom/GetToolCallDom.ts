import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallArgumentPreview } from '../GetToolCallArgumentPreview/GetToolCallArgumentPreview.ts'

export const getToolCallDom = (toolCall: { readonly name: string; readonly arguments: string }): readonly VirtualDomNode[] => {
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
}
