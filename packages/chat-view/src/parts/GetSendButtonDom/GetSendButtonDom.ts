import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getSendButtonClassName } from '../GetSendButtonClassName/GetSendButtonClassName.ts'
import * as InputName from '../InputName/InputName.ts'

export const getSendButtonDom = (isSendDisabled: boolean, voiceDictationEnabled: boolean, requestInProgress = false): readonly VirtualDomNode[] => {
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
      buttonType: requestInProgress ? 'button' : 'submit',
      childCount: 1,
      className: sendButtonClassName,
      disabled: isSendDisabled,
      name: requestInProgress ? InputName.Stop : InputName.Send,
      title: requestInProgress ? Strings.stopMessageGeneration() : Strings.sendMessage(),
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconSend',
      type: VirtualDomElements.Div,
    },
  ]
}
