import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageListItemNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getInlineNodeDom } from '../GetInlineNodeDom/GetInlineNodeDom.ts'

export const getUnorderedListItemDom = (item: MessageListItemNode, useChatMathWorker: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: item.children.length,
      className: ClassNames.ChatUnorderedListItem,
      type: VirtualDomElements.Li,
    },
    ...item.children.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
  ]
}
