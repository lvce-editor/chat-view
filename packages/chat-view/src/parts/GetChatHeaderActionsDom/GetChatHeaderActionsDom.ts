import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getHeaderActionVirtualDom } from '../GetHeaderActionVirtualDom/GetHeaderActionVirtualDom.ts'

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
    ...items.flatMap(getHeaderActionVirtualDom),
  ]
}
