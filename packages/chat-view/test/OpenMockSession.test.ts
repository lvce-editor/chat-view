import { beforeEach, expect, test } from '@jest/globals'
import { resetChatSessionStorage } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import type { ChatMessage, ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as OpenMockSession from '../src/parts/OpenMockSession/OpenMockSession.ts'

beforeEach(() => {
  resetChatSessionStorage()
})

test('openMockSession should create a mock session and switch to detail mode', async () => {
  const state: ChatState = createDefaultState()
  const mockChatMessages: readonly ChatMessage[] = [
    {
      id: 'message-1',
      role: 'user',
      text: 'hello',
      time: '10:00',
    },
    {
      id: 'message-2',
      role: 'assistant',
      text: 'hi',
      time: '10:01',
    },
  ]

  const result = await OpenMockSession.openMockSession(state, 'mock-session-1', mockChatMessages)

  expect(result.viewMode).toBe('detail')
  expect(result.selectedSessionId).toBe('mock-session-1')
  expect(result.sessions).toHaveLength(2)
  expect(result.sessions[1]).toEqual({
    id: 'mock-session-1',
    messages: mockChatMessages,
    title: 'mock-session-1',
  })
})

test('openMockSession should replace messages for existing session', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    sessions: [
      {
        id: 'mock-session-1',
        messages: [
          {
            id: 'message-old',
            role: 'user',
            text: 'old',
            time: '09:00',
          },
        ],
        title: 'Existing Mock Session',
      },
    ],
    viewMode: 'list',
  }
  const mockChatMessages: readonly ChatMessage[] = [
    {
      id: 'message-new',
      role: 'assistant',
      text: 'new',
      time: '11:00',
    },
  ]

  const result = await OpenMockSession.openMockSession(state, 'mock-session-1', mockChatMessages)

  expect(result.sessions).toHaveLength(1)
  expect(result.sessions[0].messages).toEqual(mockChatMessages)
  expect(result.sessions[0].title).toBe('Existing Mock Session')
  expect(result.selectedSessionId).toBe('mock-session-1')
  expect(result.viewMode).toBe('detail')
})

test('openMockSession should return same state for empty mockSessionId', async () => {
  const state: ChatState = createDefaultState()
  const result = await OpenMockSession.openMockSession(state, '', [])
  expect(result).toBe(state)
})
