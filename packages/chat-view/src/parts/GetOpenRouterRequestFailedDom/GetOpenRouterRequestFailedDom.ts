import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import { openRouterRequestFailureReasons } from '../chatViewStrings/chatViewStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getOpenRouterRequestFailedDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: openRouterRequestFailureReasons.length,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    ...openRouterRequestFailureReasons.flatMap((reason) => {
      return [
        {
          childCount: 1,
          className: ClassNames.ChatOrderedListItem,
          type: VirtualDomElements.Li,
        },
        text(reason),
      ]
    }),
  ]
}
