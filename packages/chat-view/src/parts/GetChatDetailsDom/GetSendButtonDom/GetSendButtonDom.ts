import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../../GetChatViewDomStrings/GetChatViewDomStrings.ts'

export const getSendButtonDom = (isSendDisabled: boolean): readonly VirtualDomNode[] => {
  const sendButtonClassName = isSendDisabled
    ? `${ClassNames.Button} ${ClassNames.ButtonPrimary} ${ClassNames.ButtonDisabled}`
    : `${ClassNames.Button} ${ClassNames.ButtonPrimary}`
  return [
    {
      childCount: 1,
      className: sendButtonClassName,
      disabled: isSendDisabled,
      name: 'send',
      onClick: DomEventListenerFunctions.HandleSubmit,
      role: AriaRoles.Button,
      title: Strings.sendMessage,
      type: VirtualDomElements.Button,
    },
    text(Strings.send),
  ]
}
