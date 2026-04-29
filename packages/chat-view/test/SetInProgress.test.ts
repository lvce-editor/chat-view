import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetInProgress from '../src/parts/SetInProgress/SetInProgress.ts'

test('setInProgress should append an in-progress assistant message to the selected session', () => {
  const state = {
    ...createDefaultState(),
    nextMessageId: 2,
    selectedSessionId: 'session-1',
    sessions: [
      {
        id: 'session-1',
        messages: [{ id: 'message-1', role: 'user' as const, text: 'hello', time: '10:00' }],
        title: 'session-1',
      },
    ],
  }

  const result = SetInProgress.setInProgress(state, true)

  expect(result.nextMessageId).toBe(3)
  expect(result.sessions).toEqual([
    {
      id: 'session-1',
      messages: [
        { id: 'message-1', role: 'user', text: 'hello', time: '10:00' },
        { id: 'message-2', inProgress: true, role: 'assistant', text: '', time: '10:00' },
      ],
      status: 'in-progress',
      title: 'session-1',
    },
  ])
})

test('setInProgress should clear the in-progress state from the selected session', () => {
  const state = {
    ...createDefaultState(),
    nextMessageId: 3,
    selectedSessionId: 'session-1',
    sessions: [
      {
        id: 'session-1',
        messages: [
          { id: 'message-1', role: 'user' as const, text: 'hello', time: '10:00' },
          { id: 'message-2', inProgress: true, role: 'assistant' as const, text: 'partial', time: '10:01' },
        ],
        status: 'in-progress' as const,
        title: 'session-1',
      },
    ],
  }

  const result = SetInProgress.setInProgress(state, false)

  expect(result.nextMessageId).toBe(3)
  expect(result.sessions).toEqual([
    {
      id: 'session-1',
      messages: [
        { id: 'message-1', role: 'user', text: 'hello', time: '10:00' },
        { id: 'message-2', inProgress: false, role: 'assistant', text: 'partial', time: '10:01' },
      ],
      status: 'finished',
      title: 'session-1',
    },
  ])
})
