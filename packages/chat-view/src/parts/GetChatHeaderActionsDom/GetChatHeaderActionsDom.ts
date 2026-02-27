<<<<<<< HEAD
import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getHeaderActionVirtualDom } from '../GetHeaderActionVirtualDom/GetHeaderActionVirtualDom.ts'
=======
import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDom/GetChatViewDomStrings.ts'
>>>>>>> origin/main

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
<<<<<<< HEAD
    ...items.flatMap(getHeaderActionVirtualDom),
=======
    ...items.flatMap((item) => {
      const name = 'name' in item ? item.name : undefined
      const onClick = 'onClick' in item ? item.onClick : undefined
      return [
        {
          childCount: 1,
          className: ClassNames.IconButton,
          ...(name ? { name } : {}),
          ...(onClick ? { onClick } : {}),
          role: AriaRoles.Button,
          tabIndex: 0,
          title: item.title,
          type: VirtualDomElements.Button,
        },
        text(item.icon),
      ]
    }),
>>>>>>> origin/main
  ]
}
