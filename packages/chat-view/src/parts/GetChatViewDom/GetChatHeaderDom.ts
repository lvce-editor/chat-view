import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as Strings from './GetChatViewDomStrings.ts'

export const getChatHeaderDom = (showBackButton: boolean, selectedSessionTitle: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: ClassNames.ChatHeader,
      type: VirtualDomElements.Div,
    },
    ...(showBackButton
      ? [
          {
            childCount: 2,
            className: ClassNames.ChatName,
            type: VirtualDomElements.Div,
          },
          {
            childCount: 1,
            className: ClassNames.IconButton,
            name: 'back',
            role: AriaRoles.Button,
            tabIndex: 0,
            title: Strings.backToChats,
            type: VirtualDomElements.Button,
          },
          text('←'),
          {
            childCount: 1,
            className: ClassNames.Label,
            type: VirtualDomElements.Span,
          },
          text(selectedSessionTitle),
        ]
      : [
          {
            childCount: 1,
            className: ClassNames.Label,
            type: VirtualDomElements.Span,
          },
          text(Strings.chats),
        ]),
  ]
}
