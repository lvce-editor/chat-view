import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import { openRouterTooManyRequestsReasons } from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const chatOrderedListNode: VirtualDomNode = {
  childCount: openRouterTooManyRequestsReasons.length,
  className: ClassNames.ChatOrderedList,
  type: VirtualDomElements.Ol,
}

const chatOrderedListItemNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ChatOrderedListItem,
  type: VirtualDomElements.Li,
}

export const getOpenRouterTooManyRequestsDom = (): readonly VirtualDomNode[] => {
  return [
    chatOrderedListNode,
    ...openRouterTooManyRequestsReasons.flatMap((reason) => {
      return [chatOrderedListItemNode, text(reason)]
    }),
  ]
}
