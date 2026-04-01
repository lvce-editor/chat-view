import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as OpenMockSessions from '../src/parts/OpenMockSessions/OpenMockSessions.ts'

test('openMockSessions should seed the requested number of sessions in list mode', async () => {
  const state = createDefaultState()

  const result = await OpenMockSessions.openMockSessions(state, 3)

  expect(result.sessions).toEqual([
    {
      id: 'session-1',
      messages: [],
      title: 'Chat 1',
    },
    {
      id: 'session-2',
      messages: [],
      title: 'Chat 2',
    },
    {
      id: 'session-3',
      messages: [],
      title: 'Chat 3',
    },
  ])
  expect(result.selectedSessionId).toBe('')
  expect(result.viewMode).toBe('list')
  expect(result.chatListScrollTop).toBe(0)
})

test('openMockSessions should return same state for invalid counts', async () => {
  const state = createDefaultState()

  const result = await OpenMockSessions.openMockSessions(state, -1)

  expect(result).toBe(state)
})
