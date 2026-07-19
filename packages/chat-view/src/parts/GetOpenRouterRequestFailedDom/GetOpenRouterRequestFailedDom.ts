import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import { openRouterRequestFailureReasons } from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const chatOrderedListNode: VirtualDomNode = {
  childCount: openRouterRequestFailureReasons.length,
  className: ClassNames.ChatOrderedList,
  type: VirtualDomElements.Ol,
}

const chatOrderedListItemNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ChatOrderedListItem,
  type: VirtualDomElements.Li,
}

export const getOpenRouterRequestFailedDom = (): readonly VirtualDomNode[] => {
  return [
    chatOrderedListNode,
    ...openRouterRequestFailureReasons.flatMap((reason) => {
      return [chatOrderedListItemNode, text(reason)]
    }),
  ]
}
