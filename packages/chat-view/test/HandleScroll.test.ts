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
  const result = await HandleScroll.handleMessagesScroll(state, 77, 200, 100)
  expect(result.messagesScrollTop).toBe(77)
  expect(result.messagesAutoScrollEnabled).toBe(false)
})

test('handleMessagesScroll should return same state when unchanged', async () => {
  const state = {
    ...createDefaultState(),
    messagesScrollTop: 25,
  }
  const result = await HandleScroll.handleMessagesScroll(state, 25, 125, 100)
  expect(result).toBe(state)
})

test('handleMessagesScroll should re-enable auto scroll when at bottom', async () => {
  const state = {
    ...createDefaultState(),
    messagesAutoScrollEnabled: false,
    messagesScrollTop: 90,
  }
  const result = await HandleScroll.handleMessagesScroll(state, 100, 200, 100)
  expect(result.messagesAutoScrollEnabled).toBe(true)
})
