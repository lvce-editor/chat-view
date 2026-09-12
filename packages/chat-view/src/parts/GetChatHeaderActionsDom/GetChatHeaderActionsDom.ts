import { type VirtualDomNode, AriaRoles, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getHeaderActionVirtualDom } from '../GetHeaderActionVirtualDom/GetHeaderActionVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

const layoutIconClassName = mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconLayoutPanelLeft)
const searchIconClassName = mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconSearch)
const debugIconClassName = mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconDebugPause)
const addIconClassName = mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconAdd)
const settingsIconClassName = mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconSettingsGear)
const closeIconClassName = mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconClose)

export const getChatHeaderActionsDom = (viewMode: ChatViewMode, searchEnabled = false): readonly VirtualDomNode[] => {
  const toggleTitle = viewMode === 'chat-focus' ? Strings.normalChatMode() : Strings.chatFocusMode()
  const items = [
    {
      icon: layoutIconClassName,
      name: InputName.ToggleChatFocus,
      onClick: DomEventListenerFunctions.HandleClick,
      title: toggleTitle,
    },
    ...(searchEnabled
      ? [
          {
            icon: searchIconClassName,
            name: InputName.ToggleSearch,
            onClick: DomEventListenerFunctions.HandleClick,
            title: Strings.search(),
          } as const,
        ]
      : []),
    {
      icon: debugIconClassName,
      name: InputName.SessionDebug,
      onClick: DomEventListenerFunctions.HandleClickSessionDebug,
      title: Strings.debug(),
    },
    {
      icon: addIconClassName,
      name: InputName.CreateSession,
      onClick: DomEventListenerFunctions.HandleClickNew,
      title: Strings.newChat(),
    },
    {
      icon: settingsIconClassName,
      name: InputName.Settings,
      onClick: DomEventListenerFunctions.HandleClickSettings,
      title: Strings.settings(),
    },
    {
      icon: closeIconClassName,
      name: InputName.CloseChat,
      onClick: DomEventListenerFunctions.HandleClickClose,
      title: Strings.closeChat(),
    },
  ] as const

  return [
    {
      'aria-label': 'chat actions',
      childCount: items.length,
      className: ClassNames.ChatActions,
      role: AriaRoles.ToolBar,
      type: VirtualDomElements.Div,
    },
    ...items.flatMap(getHeaderActionVirtualDom),
  ]
}
