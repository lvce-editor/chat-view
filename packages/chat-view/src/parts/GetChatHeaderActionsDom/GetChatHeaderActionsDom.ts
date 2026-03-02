import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getHeaderActionVirtualDom } from '../GetHeaderActionVirtualDom/GetHeaderActionVirtualDom.ts'

export const getChatHeaderActionsDom = (): readonly VirtualDomNode[] => {
  const items = [
    {
      icon: 'MaskIcon MaskIconAdd',
      name: 'create-session',
      onClick: DomEventListenerFunctions.HandleClickNew,
      title: Strings.newChat(),
    },
    {
      icon: 'MaskIcon MaskIconSettingsGear',
      name: 'settings',
      onClick: DomEventListenerFunctions.HandleClickSettings,
      title: Strings.settings(),
    },
    {
      icon: 'MaskIcon MaskIconClose',
      name: 'close-chat',
      onClick: DomEventListenerFunctions.HandleClickClose,
      title: Strings.closeChat(),
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
