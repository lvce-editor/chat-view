import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import { openRouterTooManyRequestsReasons } from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getOpenRouterTooManyRequestsDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: openRouterTooManyRequestsReasons.length,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    ...openRouterTooManyRequestsReasons.flatMap((reason) => {
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
