import { type VirtualDomNode, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { AuthUserState } from '../AuthUserState/AuthUserState.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

const getButtonLabel = (userState: AuthUserState, isAuthenticated: boolean): string => {
  if (userState === 'loggingOut') {
    return Strings.loggingOutFromBackend()
  }
  return isAuthenticated ? Strings.logout() : Strings.login()
}

const getButtonTitle = (userState: AuthUserState, isAuthenticated: boolean): string => {
  if (userState === 'loggingOut') {
    return Strings.loggingOutFromBackend()
  }
  return isAuthenticated ? Strings.logoutFromBackend() : Strings.loginToBackend()
}

export const getChatHeaderAuthDom = (authEnabled = false, userState: AuthUserState = 'loggedOut', userName = ''): readonly VirtualDomNode[] => {
  if (!authEnabled) {
    return []
  }
  const isAuthenticated = userState === 'loggedIn' || userState === 'loggingOut'
  const buttonName = isAuthenticated ? InputName.Logout : InputName.Login
  const buttonLabel = getButtonLabel(userState, isAuthenticated)
  const buttonTitle = getButtonTitle(userState, isAuthenticated)
  const isPending = userState === 'loggingOut'
  const displayName = userName || Strings.signedIn()
  return [
    {
      childCount: isAuthenticated ? 2 : 1,
      className: ClassNames.ChatHeaderAuth,
      type: VirtualDomElements.Div,
    },
    ...(isAuthenticated
      ? [
          {
            childCount: 1,
            className: ClassNames.ChatHeaderAuthName,
            title: displayName,
            type: VirtualDomElements.Span,
          },
          text(displayName),
        ]
      : []),
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Button, ClassNames.ButtonSecondary),
      disabled: isPending,
      inputType: 'button',
      name: buttonName,
      onClick: DomEventListenerFunctions.HandleClick,
      title: buttonTitle,
      type: VirtualDomElements.Button,
    },
    text(buttonLabel),
  ]
}
