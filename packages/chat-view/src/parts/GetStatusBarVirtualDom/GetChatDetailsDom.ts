import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getChatDetailsDom = (messagesNodes: readonly VirtualDomNode[], composerValue: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: ClassNames.ChatDetails,
      type: VirtualDomElements.Div,
    },
    {
      childCount: Math.max(messagesNodes.length, 0),
      className: ClassNames.ChatDetailsContent,
      type: VirtualDomElements.Div,
    },
    ...messagesNodes,
    {
      childCount: 1,
      className: ClassNames.ChatActions,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: ClassNames.MultilineInputBox,
      name: 'composer',
      placeholder: 'Type your message. Enter to send, Shift+Enter for newline.',
      rows: 4,
      type: VirtualDomElements.TextArea,
      value: composerValue,
    },
  ]
}
