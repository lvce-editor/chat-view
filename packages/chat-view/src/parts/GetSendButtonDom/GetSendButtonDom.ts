import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getSendButtonClassName } from '../GetSendButtonClassName/GetSendButtonClassName.ts'
import * as InputName from '../InputName/InputName.ts'

export const getSendButtonDom = (
  isSendDisabled: boolean,
  voiceDictationEnabled: boolean,
  isSessionInProgress: boolean,
): readonly VirtualDomNode[] => {
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
    ...(isSessionInProgress
      ? [
          {
            buttonType: 'button',
            childCount: 1,
            className: ClassNames.Button,
            name: InputName.Stop,
            onClick: DomEventListenerFunctions.HandleClick,
            title: Strings.stop(),
            type: VirtualDomElements.Button,
          },
          text(Strings.stop()),
        ]
      : [
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
            className: 'MaskIcon MaskIconArrowUp',
            role: 'none',
            type: VirtualDomElements.Div,
          },
        ]),
  ]
}
