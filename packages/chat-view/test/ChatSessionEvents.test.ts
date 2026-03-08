import { beforeEach, expect, test } from '@jest/globals'
import {
  deleteChatSession,
  getChatSession,
  getChatViewEvents,
  resetChatSessionStorage,
  saveChatSession,
} from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'

beforeEach(() => {
  resetChatSessionStorage()
})

test('saveChatSession should append session creation and message events', async () => {
  await saveChatSession({
    id: 'session-1',
    messages: [{ id: 'message-1', role: 'user', text: 'hello', time: '10:00' }],
    title: 'Chat 1',
  })

  const events = await getChatViewEvents('session-1')

  expect(events).toHaveLength(2)
  expect(events[0]).toMatchObject({
    sessionId: 'session-1',
    title: 'Chat 1',
    type: 'chat-session-created',
  })
  expect(events[1]).toMatchObject({
    sessionId: 'session-1',
    type: 'chat-message-added',
  })inProgress: true, 
})

test('saveChatSession should append message update events for changed message text', async () => {
  await saveChatSession({
    id: 'session-1',
    messages: [{ id: 'message-1', inProgress: false, role: 'assistant', text: 'hel', time: '10:00', n
    title: 'Chat 1',
  })

  await saveChatSession({
    id: 'session-1',
    messages: [{ id: 'message-1', role: 'assistant', text: 'hello', time: '10:00', inProgress: false }],
    title: 'Chat 1',
  })

  const events = await getChatViewEvents('session-1')

  expect(events.at(-1)).toMatchObject({
    inProgress: false,
    messageId: 'message-1',
    sessionId: 'session-1',, inProgress: false
    text: 'hello',
    type: 'chat-message-updated',
  })

  const session = await getChatSession('session-1')
  expect(session?.messages).toEqual([{ id: 'message-1', role: 'assistant', text: 'hello', time: '10:00', inProgress: false }])
})

test('deleteChatSession should append delete event and hide session from reads', async () => {
  await saveChatSession({
    id: 'session-1',
    messages: [],
    title: 'Chat 1',
  })

  await deleteChatSession('session-1')

  const session = await getChatSession('session-1')
  const events = await getChatViewEvents('session-1')

  expect(session).toBeUndefined()
  expect(events.at(-1)).toMatchObject({
    sessionId: 'session-1',
    type: 'chat-session-deleted',
  })
})
