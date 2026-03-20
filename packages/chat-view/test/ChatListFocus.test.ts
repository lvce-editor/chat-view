import { expect, test } from '@jest/globals'
import * as ChatListFocusFirst from '../src/parts/ChatListFocusFirst/ChatListFocusFirst.ts'
import * as ChatListFocusLast from '../src/parts/ChatListFocusLast/ChatListFocusLast.ts'
import * as ChatListFocusNext from '../src/parts/ChatListFocusNext/ChatListFocusNext.ts'
import * as ChatListFocusPrevious from '../src/parts/ChatListFocusPrevious/ChatListFocusPrevious.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('chatListFocusNext should focus first item from container focus', async () => {
  const state = { ...createDefaultState(), listFocusedIndex: -1 }
  const result = await ChatListFocusNext.chatListFocusNext(state)
  expect(result.listFocusedIndex).toBe(0)
})

test('chatListFocusPrevious should focus last item from container focus', async () => {
  const state = {
    ...createDefaultState(),
    listFocusedIndex: -1,
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
  }
  const result = await ChatListFocusPrevious.chatListFocusPrevious(state)
  expect(result.listFocusedIndex).toBe(1)
})

test('chatListFocusFirst should focus first item', async () => {
  const state = { ...createDefaultState(), listFocusedIndex: 2 }
  const result = await ChatListFocusFirst.chatListFocusFirst(state)
  expect(result.listFocusedIndex).toBe(0)
})

test('chatListFocusLast should focus last item', async () => {
  const state = {
    ...createDefaultState(),
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
      { id: 'session-3', messages: [], title: 'Chat 3' },
    ],
  }
  const result = await ChatListFocusLast.chatListFocusLast(state)
  expect(result.listFocusedIndex).toBe(2)
})

test('chatListFocus commands should keep -1 for empty list', async () => {
  const state = {
    ...createDefaultState(),
    selectedSessionId: '',
    sessions: [],
  }
  const first = await ChatListFocusFirst.chatListFocusFirst(state)
  const last = await ChatListFocusLast.chatListFocusLast(state)
  const next = await ChatListFocusNext.chatListFocusNext(state)
  const previous = await ChatListFocusPrevious.chatListFocusPrevious(state)
  expect(first.listFocusedIndex).toBe(-1)
  expect(last.listFocusedIndex).toBe(-1)
  expect(next.listFocusedIndex).toBe(-1)
  expect(previous.listFocusedIndex).toBe(-1)
})
