import { expect, test } from '@jest/globals'
import type { ChatMessage } from '../src/parts/ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../src/parts/ChatSession/ChatSession.ts'
import * as AppendMessageToSelectedSession from '../src/parts/AppendMessageToSelectedSession/AppendMessageToSelectedSession.ts'

const message: ChatMessage = {
  id: 'message-1',
  role: 'assistant',
  text: 'hello',
  time: '',
}

test('appendMessageToSelectedSession should append to selected session', () => {
  const sessions: readonly ChatSession[] = [
    {
      id: 'session-1',
      messages: [],
      title: 'one',
    },
    {
      id: 'session-2',
      messages: [],
      title: 'two',
    },
  ]

  const result = AppendMessageToSelectedSession.appendMessageToSelectedSession(sessions, 'session-2', message)

  expect(result).toEqual([
    {
      id: 'session-1',
      messages: [],
      title: 'one',
    },
    {
      id: 'session-2',
      messages: [message],
      title: 'two',
    },
  ])
})

test('appendMessageToSelectedSession should leave sessions unchanged when id is not found', () => {
  const sessions: readonly ChatSession[] = [
    {
      id: 'session-1',
      messages: [],
      title: 'one',
    },
  ]

  const result = AppendMessageToSelectedSession.appendMessageToSelectedSession(sessions, 'missing', message)

  expect(result).toEqual(sessions)
})
