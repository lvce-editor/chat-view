import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getChatHeaderActionsDom } from '../GetChatHeaderActionsDom/GetChatHeaderActionsDom.ts'
<<<<<<< HEAD
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
=======
import * as Strings from '../GetChatViewDom/GetChatViewDomStrings.ts'
>>>>>>> origin/main

export const getChatHeaderListModeDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: ClassNames.ChatHeader,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.Label,
      type: VirtualDomElements.Span,
    },
    text(Strings.chats),
    ...getChatHeaderActionsDom(),
  ]
}
