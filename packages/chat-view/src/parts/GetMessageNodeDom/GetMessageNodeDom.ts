import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getMessageNodeDom = (node: MessageIntermediateNode): readonly VirtualDomNode[] => {
  if (node.type === 'text') {
    return [
      {
        childCount: 1,
        className: ClassNames.Markdown,
        type: VirtualDomElements.P,
      },
      text(node.text),
    ]
  }
  return [
    {
      childCount: node.items.length,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    ...node.items.flatMap((item) => {
      return [
        {
          childCount: 1,
          className: ClassNames.ChatOrderedListItem,
          type: VirtualDomElements.Li,
        },
        text(item.text),
      ]
    }),
  ]
}
