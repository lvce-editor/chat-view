import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClickChatListMarkAllAsRead from '../src/parts/HandleClickChatListMarkAllAsRead/HandleClickChatListMarkAllAsRead.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('handleClickChatListMarkAllAsRead should clear unread for visible sessions only', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()

  const state: ChatState = {
    ...createDefaultState(),
    selectedProjectId: 'project-1',
    sessions: [
      { id: 'session-1', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 1', unread: true },
      { id: 'session-2', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 2', unread: true },
      { id: 'session-3', messages: [], projectId: 'project-2', status: 'idle', title: 'Chat 3', unread: true },
    ],
  }

  const result = await HandleClickChatListMarkAllAsRead.handleClickChatListMarkAllAsRead(state)

  expect(result.sessions).toEqual([
    { id: 'session-1', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 1', unread: false },
    { id: 'session-2', messages: [], projectId: 'project-1', status: 'idle', title: 'Chat 2', unread: false },
    { id: 'session-3', messages: [], projectId: 'project-2', status: 'idle', title: 'Chat 3', unread: true },
  ])
})
