import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDom/GetChatViewDomStrings.ts'

export const getChatHeaderActionsDom = (): readonly VirtualDomNode[] => {
  const items = [
    {
      icon: '+',
      name: 'create-session',
      title: Strings.newChat,
    },
    {
      icon: '⚙',
      onClick: DomEventListenerFunctions.HandleClickSettings,
      title: Strings.settings,
    },
    {
      icon: '×',
      onClick: DomEventListenerFunctions.HandleClickClose,
      title: Strings.closeChat,
    },
  ] as const

  return [
    {
      childCount: items.length,
      className: ClassNames.ChatActions,
      type: VirtualDomElements.Div,
    },
    ...items.flatMap((item) => {
      return [
        {
          childCount: 1,
          className: ClassNames.IconButton,
          ...(item.name ? { name: item.name } : {}),
          ...(item.onClick ? { onClick: item.onClick } : {}),
          role: AriaRoles.Button,
          tabIndex: 0,
          title: item.title,
          type: VirtualDomElements.Button,
        },
        text(item.icon),
      ]
    }),
  ]
}
