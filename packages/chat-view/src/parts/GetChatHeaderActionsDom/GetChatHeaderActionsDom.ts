import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getHeaderActionVirtualDom } from '../GetHeaderActionVirtualDom/GetHeaderActionVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatHeaderActionsDom = (
  viewMode: ChatViewMode,
  authEnabled = false,
  authStatus: 'signed-out' | 'signing-in' | 'signed-in' = 'signed-out',
  searchEnabled = false,
): readonly VirtualDomNode[] => {
  const toggleTitle = viewMode === 'chat-focus' ? Strings.normalChatMode() : Strings.chatFocusMode()
  const isSigningIn = authStatus === 'signing-in'
  const authAction =
    authEnabled && authStatus !== 'signed-in'
      ? ({
          disabled: isSigningIn,
          icon: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconAccount),
          name: InputName.Login,
          onClick: DomEventListenerFunctions.HandleClick,
          title: isSigningIn ? Strings.loggingInToBackend() : Strings.loginToBackend(),
        } as const)
      : authEnabled
        ? ({
            disabled: false,
            icon: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconSignOut),
            name: InputName.Logout,
            onClick: DomEventListenerFunctions.HandleClick,
            title: Strings.logoutFromBackend(),
          } as const)
        : undefined
  const items = [
    {
      icon: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconLayoutPanelLeft),
      name: InputName.ToggleChatFocus,
      onClick: DomEventListenerFunctions.HandleClick,
      title: toggleTitle,
    },
    ...(searchEnabled
      ? [
          {
            icon: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconSearch),
            name: InputName.ToggleSearch,
            onClick: DomEventListenerFunctions.HandleClick,
            title: Strings.search(),
          } as const,
        ]
      : []),
    {
      icon: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconDebugPause),
      name: InputName.SessionDebug,
      onClick: DomEventListenerFunctions.HandleClickSessionDebug,
      title: Strings.debug(),
    },
    {
      icon: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconAdd),
      name: InputName.CreateSession,
      onClick: DomEventListenerFunctions.HandleClickNew,
      title: Strings.newChat(),
    },
    {
      icon: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconSettingsGear),
      name: InputName.Settings,
      onClick: DomEventListenerFunctions.HandleClickSettings,
      title: Strings.settings(),
    },
    ...(authAction ? [authAction] : []),
    {
      icon: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconClose),
      name: InputName.CloseChat,
      onClick: DomEventListenerFunctions.HandleClickClose,
      title: Strings.closeChat(),
    },
  ] as const

  return [
    {
      childCount: items.length,
      className: ClassNames.ChatActions,
      role: 'toolbar',
      type: VirtualDomElements.Div,
    },
    ...items.flatMap(getHeaderActionVirtualDom),
  ]
}
