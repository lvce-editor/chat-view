import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
<<<<<<< HEAD
=======
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
>>>>>>> origin/main
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
            role: AriaRoles.Button,
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
      childCount: 1,
      className: sendButtonClassName,
      disabled: isSendDisabled,
      name: InputName.Send,
      buttonType: 'submit',
      role: AriaRoles.Button,
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
