import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { deleteSessionAtIndex } from '../src/parts/DeleteSession/DeleteSession.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('deleteSessionAtIndex should delete a session at the given index', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = {
    ...createDefaultState(),
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
  }

  const result = await deleteSessionAtIndex(state, 1)

  expect(result.sessions).toHaveLength(1)
  expect(result.sessions[0].id).toBe('session-1')
})

test('deleteSessionAtIndex should return state when index is out of bounds', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = {
    ...createDefaultState(),
    sessions: [{ id: 'session-1', messages: [], title: 'Chat 1' }],
  }

  const result = await deleteSessionAtIndex(state, 10)

  expect(result).toBe(state)
})
