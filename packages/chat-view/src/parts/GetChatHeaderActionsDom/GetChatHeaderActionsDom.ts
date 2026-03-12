import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getHeaderActionVirtualDom } from '../GetHeaderActionVirtualDom/GetHeaderActionVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatHeaderActionsDom = (viewMode: ChatViewMode): readonly VirtualDomNode[] => {
  const toggleTitle = viewMode === 'chat-focus' ? Strings.normalChatMode() : Strings.chatFocusMode()
  const items = [
    {
      icon: 'MaskIcon MaskIconLayoutPanelLeft',
      name: InputName.ToggleChatFocus,
      onClick: DomEventListenerFunctions.HandleClick,
      title: toggleTitle,
    },
    {
      icon: 'MaskIcon MaskIconDebugPause',
      name: InputName.SessionDebug,
      onClick: DomEventListenerFunctions.HandleClickSessionDebug,
      title: Strings.debug(),
    },
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
