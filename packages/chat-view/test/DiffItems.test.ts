import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffItems from '../src/parts/DiffItems/DiffItems.ts'

test('isEqual should return true for identical state object', () => {
  const state: ChatState = createDefaultState()
  expect(DiffItems.isEqual(state, state)).toBe(true)
})

test('isEqual should return true for equivalent chat state', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }] as const
  const state1: ChatState = { ...createDefaultState(), sessions }
  const state2: ChatState = { ...createDefaultState(), sessions }
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})

test('isEqual should return false when only composer changes', () => {
  const { sessions } = createDefaultState()
  const state1: ChatState = { ...createDefaultState(), composerValue: 'a', sessions }
  const state2: ChatState = { ...createDefaultState(), composerValue: 'b', sessions }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when selectedSessionId changes', () => {
  const state1: ChatState = createDefaultState()
  const state2: ChatState = { ...createDefaultState(), selectedSessionId: 'session-2' }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when selectedModelId changes', () => {
  const state1: ChatState = createDefaultState()
  const state2: ChatState = { ...createDefaultState(), selectedModelId: 'codex-5.3' }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when openai api key input changes', () => {
  const { sessions } = createDefaultState()
  const state1: ChatState = { ...createDefaultState(), openApiApiKeyInput: '', sessions }
  const state2: ChatState = { ...createDefaultState(), openApiApiKeyInput: 'invalid-key', sessions }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when openrouter api key input changes', () => {
  const { sessions } = createDefaultState()
  const state1: ChatState = { ...createDefaultState(), openRouterApiKeyInput: '', sessions }
  const state2: ChatState = { ...createDefaultState(), openRouterApiKeyInput: 'or-key-typed', sessions }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when sessions reference changes', () => {
  const state1: ChatState = createDefaultState()
  const state2: ChatState = {
    ...createDefaultState(),
    sessions: [{ id: 'session-1', messages: [], title: 'Chat 1' }],
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when viewMode changes', () => {
  const state1: ChatState = { ...createDefaultState(), viewMode: 'list' }
  const state2: ChatState = { ...createDefaultState(), viewMode: 'detail' }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should ignore uid when chat fields are equal', () => {
  const { sessions } = createDefaultState()
  const state1: ChatState = { ...createDefaultState(), sessions, uid: 1 }
  const state2: ChatState = { ...createDefaultState(), sessions, uid: 2 }
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})

test('isEqual should return true for equivalent composer attachments', () => {
  const { sessions } = createDefaultState()
  const composerAttachments = [{ attachmentId: '1', displayType: 'file', mimeType: 'text/plain', name: 'a.txt', size: 3 }] as const
  const state1: ChatState = { ...createDefaultState(), composerAttachments, sessions }
  const state2: ChatState = { ...createDefaultState(), composerAttachments: [...composerAttachments], sessions }
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})

test('isEqual should return false when model picker open state changes', () => {
  const state1: ChatState = { ...createDefaultState(), modelPickerOpen: false }
  const state2: ChatState = { ...createDefaultState(), modelPickerOpen: true }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when run mode picker open state changes', () => {
  const state1: ChatState = { ...createDefaultState(), runModePickerOpen: false }
  const state2: ChatState = { ...createDefaultState(), runModePickerOpen: true }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when responsive picker space changes', () => {
  const state1: ChatState = { ...createDefaultState(), hasSpaceForAgentModePicker: true }
  const state2: ChatState = { ...createDefaultState(), hasSpaceForAgentModePicker: false }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})
