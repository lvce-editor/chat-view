import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { chatListAccept } from '../src/parts/ChatListAccept/ChatListAccept.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('chatListAccept opens the focused session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state: ChatState = {
    ...createDefaultState(),
    listFocusedIndex: 1,
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
    viewMode: 'list',
  }

  const result = await chatListAccept(state)

  expect(result.selectedSessionId).toBe('session-2')
  expect(result.viewMode).toBe('detail')
})

test('chatListAccept keeps the list open when no session is focused', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    listFocusedIndex: -1,
    sessions: [{ id: 'session-1', messages: [], title: 'Chat 1' }],
    viewMode: 'list',
  }

  const result = await chatListAccept(state)

  expect(result).toBe(state)
})
