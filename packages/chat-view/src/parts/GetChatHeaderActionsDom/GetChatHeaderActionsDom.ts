import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getHeaderActionVirtualDom } from '../GetHeaderActionVirtualDom/GetHeaderActionVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatHeaderActionsDom = (): readonly VirtualDomNode[] => {
  const items = [
    {
      icon: 'MaskIcon MaskIconAdd',
      name: InputName.CreateSession,
      onClick: DomEventListenerFunctions.HandleClickNew,
      title: Strings.newChat(),
    },
    {
      icon: 'MaskIcon MaskIconSettingsGear',
      name: InputName.Settings,
      onClick: DomEventListenerFunctions.HandleClickSettings,
      title: Strings.settings(),
    },
    {
      icon: 'MaskIcon MaskIconClose',
      name: InputName.CloseChat,
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
