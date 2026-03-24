import { expect, test } from '@jest/globals'
import { WhenExpression } from '@lvce-editor/constants'
import { KeyCode, KeyModifier } from '@lvce-editor/virtual-dom-worker'
import { getKeyBindings } from '../src/parts/GetKeyBindings/GetKeyBindings.ts'

test('getKeyBindings should include chat list navigation keybindings', () => {
  const result = getKeyBindings()
  expect(result).toContainEqual({
    command: 'Chat.chatListFocusNext',
    key: KeyCode.DownArrow,
    when: WhenExpression.FocusChatList,
  })
  expect(result).toContainEqual({
    command: 'Chat.chatListFocusPrevious',
    key: KeyCode.UpArrow,
    when: WhenExpression.FocusChatList,
  })
  expect(result).toContainEqual({
    command: 'Chat.chatListFocusFirst',
    key: KeyCode.Home,
    when: WhenExpression.FocusChatList,
  })
  expect(result).toContainEqual({
    command: 'Chat.chatListFocusLast',
    key: KeyCode.End,
    when: WhenExpression.FocusChatList,
  })
})

test('getKeyBindings should include chat input history navigation keybindings', () => {
  const result = getKeyBindings()
  expect(result).toContainEqual({
    command: 'Chat.chatInputHistoryUp',
    key: KeyCode.UpArrow,
    when: WhenExpression.FocusChatInput,
  })
  expect(result).toContainEqual({
    command: 'Chat.chatInputHistoryDown',
    key: KeyCode.DownArrow,
    when: WhenExpression.FocusChatInput,
  })
})

test('getKeyBindings should keep enter and shift-enter bindings', () => {
  const result = getKeyBindings()
  expect(result).toContainEqual({
    command: 'Chat.handleSubmit',
    key: KeyCode.Enter,
    when: WhenExpression.FocusChatInput,
  })
  expect(result).toContainEqual({
    command: 'Chat.enterNewLine',
    key: KeyModifier.Shift | KeyCode.Enter,
    when: WhenExpression.FocusChatInput,
  })
})
