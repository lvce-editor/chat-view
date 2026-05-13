import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { setInProgress } from '../src/parts/SetInProgress/SetInProgress.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('setInProgress should mark the latest assistant message as in progress', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  const state = {
    ...createDefaultState(),
    selectedSessionId: 'session-1',
    sessions: [
      {
        id: 'session-1',
        messages: [
          {
            id: 'message-user-1',
            role: 'user' as const,
            text: 'hello',
            time: '10:00',
          },
          {
            id: 'message-assistant-1',
            role: 'assistant' as const,
            text: 'partial',
            time: '10:01',
          },
        ],
        title: 'Chat 1',
      },
    ],
  }

  const result = await setInProgress(state, true)

  expect(result.sessions).toEqual([
    {
      id: 'session-1',
      messages: [
        {
          id: 'message-user-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
        {
          id: 'message-assistant-1',
          inProgress: true,
          role: 'assistant',
          text: 'partial',
          time: '10:01',
        },
      ],
      status: 'in-progress',
      title: 'Chat 1',
    },
  ])
  expect(mockChatStorageRpc.invocations).toEqual([
    [
      'ChatStorage.setSession',
      {
        id: 'session-1',
        lastActiveTime: '10:01',
        messages: [
          {
            id: 'message-user-1',
            role: 'user',
            text: 'hello',
            time: '10:00',
          },
          {
            id: 'message-assistant-1',
            inProgress: true,
            role: 'assistant',
            text: 'partial',
            time: '10:01',
          },
        ],
        status: 'in-progress',
        title: 'Chat 1',
      },
    ],
  ])
})

test('setInProgress should clear in progress from the latest assistant message', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  const state = {
    ...createDefaultState(),
    selectedSessionId: 'session-1',
    sessions: [
      {
        id: 'session-1',
        messages: [
          {
            id: 'message-user-1',
            role: 'user' as const,
            text: 'hello',
            time: '10:00',
          },
          {
            id: 'message-assistant-1',
            inProgress: true,
            role: 'assistant' as const,
            text: 'partial',
            time: '10:01',
          },
        ],
        status: 'in-progress' as const,
        title: 'Chat 1',
      },
    ],
  }

  const result = await setInProgress(state, false)

  expect(result.sessions).toEqual([
    {
      id: 'session-1',
      messages: [
        {
          id: 'message-user-1',
          role: 'user',
          text: 'hello',
          time: '10:00',
        },
        {
          id: 'message-assistant-1',
          inProgress: false,
          role: 'assistant',
          text: 'partial',
          time: '10:01',
        },
      ],
      status: 'finished',
      title: 'Chat 1',
    },
  ])
  expect(mockChatStorageRpc.invocations).toEqual([
    [
      'ChatStorage.setSession',
      {
        id: 'session-1',
        lastActiveTime: '10:01',
        messages: [
          {
            id: 'message-user-1',
            role: 'user',
            text: 'hello',
            time: '10:00',
          },
          {
            id: 'message-assistant-1',
            inProgress: false,
            role: 'assistant',
            text: 'partial',
            time: '10:01',
          },
        ],
        status: 'finished',
        title: 'Chat 1',
      },
    ],
  ])
})
