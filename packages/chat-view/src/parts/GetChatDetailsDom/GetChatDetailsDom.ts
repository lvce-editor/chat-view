import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

export const getChatSendAreaDom = (composerValue: string): readonly VirtualDomNode[] => {
  const isSendDisabled = composerValue.trim() === ''
  return [
    {
      childCount: 2,
      className: ClassNames.ChatSendArea,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: ClassNames.MultilineInputBox,
      name: 'composer',
      onInput: DomEventListenerFunctions.HandleInput,
      placeholder: Strings.composePlaceholder,
      rows: 4,
      type: VirtualDomElements.TextArea,
      value: composerValue,
    },
    {
      childCount: 1,
      className: ClassNames.Button + ' ' + ClassNames.ButtonPrimary,
      disabled: isSendDisabled,
      name: 'send',
      onClick: DomEventListenerFunctions.handleSubmit,
      role: AriaRoles.Button,
      title: Strings.sendMessage,
      type: VirtualDomElements.Button,
    },
    text(Strings.send),
  ]
}

export const getChatDetailsDom = (
  selectedSessionTitle: string,
  messagesNodes: readonly VirtualDomNode[],
  composerValue: string,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 3,
      className: ClassNames.ChatDetails,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.Label,
      type: VirtualDomElements.Span,
    },
    text(selectedSessionTitle),

    ...getChatSendAreaDom(composerValue),
  ]
}
