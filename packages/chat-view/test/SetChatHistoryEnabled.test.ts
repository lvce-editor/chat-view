import { expect, test } from '@jest/globals'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetChatHistoryEnabled from '../src/parts/SetChatHistoryEnabled/SetChatHistoryEnabled.ts'

test('setChatHistoryEnabled should set chatHistoryEnabled to true', () => {
  const state = CreateDefaultState.createDefaultState()
  const result = SetChatHistoryEnabled.setChatHistoryEnabled(state, true)
  expect(result.chatHistoryEnabled).toBe(true)
})

test('setChatHistoryEnabled should reset active history navigation when disabling', () => {
  const state = {
    ...CreateDefaultState.createDefaultState(),
    chatHistoryEnabled: true,
    chatInputHistory: ['first', 'second'],
    chatInputHistoryDraft: 'draft',
    chatInputHistoryIndex: 1,
    composerSelectionEnd: 5,
    composerSelectionStart: 2,
  }
  const result = SetChatHistoryEnabled.setChatHistoryEnabled(state, false)
  expect(result.chatHistoryEnabled).toBe(false)
  expect(result.chatInputHistory).toEqual(['first', 'second'])
  expect(result.chatInputHistoryDraft).toBe('')
  expect(result.chatInputHistoryIndex).toBe(-1)
  expect(result.composerSelectionStart).toBe(0)
  expect(result.composerSelectionEnd).toBe(0)
})
