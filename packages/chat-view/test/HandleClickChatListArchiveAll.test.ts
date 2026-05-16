import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClickChatListArchiveAll from '../src/parts/HandleClickChatListArchiveAll/HandleClickChatListArchiveAll.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('handleClickChatListArchiveAll should archive visible sessions only', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()

  const state: ChatState = {
    ...createDefaultState(),
    messages: [{ id: 'message-1', role: 'user', text: 'hello', time: '10:00' }],
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
    sessions: [
      { id: 'session-1', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 1' },
      { id: 'session-2', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 2' },
      { id: 'session-3', messages: [], projectId: 'project-2', status: 'idle', title: 'Chat 3' },
    ],
    viewMode: 'detail',
  }

  const result = await HandleClickChatListArchiveAll.handleClickChatListArchiveAll(state)

  expect(result.sessions).toEqual([{ id: 'session-3', messages: [], projectId: 'project-2', status: 'idle', title: 'Chat 3' }])
  expect(result.selectedSessionId).toBe('')
  expect(result.messages).toEqual([])
  expect(result.viewMode).toBe('list')
  expect(mockChatStorageRpc.invocations).toEqual([
    ['ChatStorage.deleteSession', 'session-1'],
    ['ChatStorage.deleteSession', 'session-2'],
  ])
})