import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleScroll from '../src/parts/HandleScroll/HandleScroll.ts'

test('handleChatListScroll should update chatListScrollTop', async () => {
  const state = createDefaultState()
  const result = await HandleScroll.handleChatListScroll(state, 123)
  expect(result.chatListScrollTop).toBe(123)
})

test('handleChatListScroll should return same state when unchanged', async () => {
  const state = {
    ...createDefaultState(),
    chatListScrollTop: 50,
  }
  const result = await HandleScroll.handleChatListScroll(state, 50)
  expect(result).toBe(state)
})

test('handleMessagesScroll should update messagesScrollTop', async () => {
  const state = createDefaultState()
  const result = await HandleScroll.handleMessagesScroll(state, 77)
  expect(result.messagesScrollTop).toBe(77)
})

test('handleMessagesScroll should return same state when unchanged', async () => {
  const state = {
    ...createDefaultState(),
    messagesScrollTop: 25,
  }
  const result = await HandleScroll.handleMessagesScroll(state, 25)
  expect(result).toBe(state)
})
