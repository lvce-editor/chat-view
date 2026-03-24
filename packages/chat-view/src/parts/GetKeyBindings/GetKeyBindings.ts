import { WhenExpression } from '@lvce-editor/constants'
import { KeyCode, KeyModifier } from '@lvce-editor/virtual-dom-worker'
import type { KeyBinding } from '../KeyBinding/KeyBinding.ts'

export const getKeyBindings = (): readonly KeyBinding[] => {
  return [
    {
      command: 'Chat.chatInputHistoryDown',
      key: KeyCode.DownArrow,
      when: WhenExpression.FocusChatInput,
    },
    {
      command: 'Chat.chatInputHistoryUp',
      key: KeyCode.UpArrow,
      when: WhenExpression.FocusChatInput,
    },
    {
      command: 'Chat.chatListFocusFirst',
      key: KeyCode.Home,
      when: WhenExpression.FocusChatList,
    },
    {
      command: 'Chat.chatListFocusLast',
      key: KeyCode.End,
      when: WhenExpression.FocusChatList,
    },
    {
      command: 'Chat.chatListFocusNext',
      key: KeyCode.DownArrow,
      when: WhenExpression.FocusChatList,
    },
    {
      command: 'Chat.chatListFocusPrevious',
      key: KeyCode.UpArrow,
      when: WhenExpression.FocusChatList,
    },
    {
      command: 'Chat.handleSubmit',
      key: KeyCode.Enter,
      when: WhenExpression.FocusChatInput,
    },
    {
      command: 'Chat.enterNewLine',
      key: KeyModifier.Shift | KeyCode.Enter,
      when: WhenExpression.FocusChatInput,
    },
  ]
}
