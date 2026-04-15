import { expect, test } from '@jest/globals'
import { ChatStorageWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClickPin from '../src/parts/HandleClickPin/HandleClickPin.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('handleClickPin should pin a session and persist it', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = {
    ...createDefaultState(),
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
  }
  const result = await HandleClickPin.handleClickPin(state, 'session-2')
  expect(result.sessions).toEqual([
    { id: 'session-1', messages: [], title: 'Chat 1' },
    { id: 'session-2', messages: [], pinned: true, title: 'Chat 2' },
  ])
  const storedSession = await ChatStorageWorker.invoke('ChatStorage.getSession', 'session-2')
  expect(storedSession).toEqual({ id: 'session-2', messages: [], pinned: true, title: 'Chat 2' })
})

test('handleClickPin should unpin a pinned session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = {
    ...createDefaultState(),
    sessions: [{ id: 'session-1', messages: [], pinned: true, title: 'Chat 1' }],
  }
  const result = await HandleClickPin.handleClickPin(state, 'session-1')
  expect(result.sessions).toEqual([{ id: 'session-1', messages: [], pinned: false, title: 'Chat 1' }])
})

test('handleClickPin should ignore toggling when session pinning is disabled', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = {
    ...createDefaultState(),
    sessionPinningEnabled: false,
    sessions: [{ id: 'session-1', messages: [], title: 'Chat 1' }],
  }
  const result = await HandleClickPin.handleClickPin(state, 'session-1')
  expect(result).toBe(state)
})
