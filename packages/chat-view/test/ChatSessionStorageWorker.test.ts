import { beforeEach, expect, test } from '@jest/globals'
import {
  appendChatViewEvent,
  clearChatSessions,
  deleteChatSession,
  getChatSession,
  getChatViewEvents,
  listChatSessions,
  resetChatSessionStorage,
  saveChatSession,
  setChatStorageWorkerEnabled,
} from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import * as ChatStorageWorker from '../src/parts/ChatStorageWorker/ChatStorageWorker.ts'

beforeEach(() => {
  resetChatSessionStorage()
})

test('chat session storage should delegate to ChatStorageWorker when enabled', async () => {
  const invocations: unknown[][] = []
  ChatStorageWorker.set({
    invoke: async (method: string, ...params: readonly unknown[]): Promise<unknown> => {
      invocations.push([method, ...params])
      switch (method) {
        case 'ChatStorage.getEvents':
          return [{ sessionId: 'worker-session', timestamp: '2026-01-01T00:00:00.000Z', title: 'From Worker', type: 'chat-session-created' }]
        case 'ChatStorage.getSession':
          return { id: 'worker-session', messages: [{ id: 'm1', role: 'user', text: 'hi', time: '10:00' }], title: 'From Worker' }
        case 'ChatStorage.listSessions':
          return [{ id: 'worker-session', messages: [{ id: 'm1', role: 'user', text: 'hi', time: '10:00' }], title: 'From Worker' }]
        default:
          return undefined
      }
    },
  })
  setChatStorageWorkerEnabled(true)

  const sessions = await listChatSessions()
  const session = await getChatSession('worker-session')
  await saveChatSession({ id: 'worker-session', messages: [], title: 'New Title' })
  await deleteChatSession('worker-session')
  await clearChatSessions()
  await appendChatViewEvent({
    sessionId: 'worker-session',
    timestamp: '2026-01-01T00:00:00.000Z',
    title: 'From Worker',
    type: 'chat-session-created',
  })
  const events = await getChatViewEvents('worker-session')

  expect(sessions).toEqual([{ id: 'worker-session', messages: [], title: 'From Worker' }])
  expect(session).toEqual({ id: 'worker-session', messages: [{ id: 'm1', role: 'user', text: 'hi', time: '10:00' }], title: 'From Worker' })
  expect(events).toEqual([{ sessionId: 'worker-session', timestamp: '2026-01-01T00:00:00.000Z', title: 'From Worker', type: 'chat-session-created' }])
  expect(invocations).toEqual([
    ['ChatStorage.listSessions'],
    ['ChatStorage.getSession', 'worker-session'],
    ['ChatStorage.setSession', { id: 'worker-session', messages: [], title: 'New Title' }],
    ['ChatStorage.deleteSession', 'worker-session'],
    ['ChatStorage.clear'],
    [
      'ChatStorage.appendEvent',
      {
        sessionId: 'worker-session',
        timestamp: '2026-01-01T00:00:00.000Z',
        title: 'From Worker',
        type: 'chat-session-created',
      },
    ],
    ['ChatStorage.getEvents', 'worker-session'],
  ])
})
