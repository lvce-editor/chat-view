import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getMessagesDom = (messages: readonly ChatMessage[]): readonly VirtualDomNode[] => {
  if (messages.length === 0) {
    return [
      {
        childCount: 1,
        className: ClassNames.ChatWelcomeMessage,
        type: VirtualDomElements.Div,
      },
      text('Start a conversation by typing below.'),
    ]
  }
  return messages.flatMap((message) => {
    return [
      {
        childCount: 2,
        className: ClassNames.Message,
        type: VirtualDomElements.Div,
      },
      {
        childCount: 1,
        className: ClassNames.Label,
        type: VirtualDomElements.Strong,
      },
      text(`${message.role === 'user' ? 'You' : 'Assistant'} · ${message.time}`),
      {
        childCount: 1,
        className: ClassNames.Markdown,
        type: VirtualDomElements.P,
      },
      text(message.text),
    ]
  })
}
