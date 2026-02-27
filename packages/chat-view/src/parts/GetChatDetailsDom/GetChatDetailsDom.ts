import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

export const getChatSendAreaDom = (composerValue: string): readonly VirtualDomNode[] => {
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
      name: 'send',
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
    {
      childCount: Math.max(messagesNodes.length, 0),
      className: ClassNames.ChatDetailsContent,
      type: VirtualDomElements.Div,
    },
    ...messagesNodes,
    ...getChatSendAreaDom(composerValue),
  ]
}
