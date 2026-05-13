import { type VirtualDomNode, AriaRoles, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getSendButtonClassName } from '../GetSendButtonClassName/GetSendButtonClassName.ts'
import * as InputName from '../InputName/InputName.ts'

export const getSubmitButtonDom = (isSendDisabled: boolean): readonly VirtualDomNode[] => {
  const sendButtonClassName = getSendButtonClassName(isSendDisabled)
  return [
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
      className: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconArrowUp),
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
  ]
}
