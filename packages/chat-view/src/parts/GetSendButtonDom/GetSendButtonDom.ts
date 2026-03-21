import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getSendButtonClassName } from '../GetSendButtonClassName/GetSendButtonClassName.ts'
import * as InputName from '../InputName/InputName.ts'

export const getSendButtonDom = (isSendDisabled: boolean, voiceDictationEnabled: boolean): readonly VirtualDomNode[] => {
  const sendButtonClassName = getSendButtonClassName(isSendDisabled)
  return [
    ...(voiceDictationEnabled
      ? [
          {
            childCount: 1,
            className: ClassNames.IconButton,
            name: InputName.Dictate,
            onClick: DomEventListenerFunctions.HandleClickDictationButton,
            title: Strings.startVoiceDictation(),
            type: VirtualDomElements.Button,
          },
          {
            childCount: 0,
            className: 'MaskIcon MaskIconMic',
            type: VirtualDomElements.Div,
          },
        ]
      : []),
    {
      buttonType: 'submit',
      childCount: 1,
      className: sendButtonClassName,
      disabled: isSendDisabled,
      name: InputName.Send,
      title: Strings.sendMessage(),
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconSend',
      type: VirtualDomElements.Div,
    },
  ]
}

export const getAddContextButtonDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.IconButton,
      name: InputName.AddContext,
      title: Strings.addContext(),
      type: VirtualDomElements.Button,
    },
    {
      text: Strings.addContext(),
      type: VirtualDomElements.Text,
    },
  ]
}

export const getBackToChatsButtonDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Button, ClassNames.ButtonSecondary),
      inputType: 'button',
      name: InputName.Back,
      onClick: DomEventListenerFunctions.HandleClickBack,
      title: Strings.backToChatList(),
      type: VirtualDomElements.Button,
    },
    {
      text: Strings.backToChatList(),
      type: VirtualDomElements.Text,
    },
  ]
}
