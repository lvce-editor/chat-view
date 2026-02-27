import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SaveState from '../src/parts/SaveState/SaveState.ts'

test('saveState should persist chat sessions and composer value', () => {
  const state: ChatState = {
    ...createDefaultState(),
    composerValue: 'draft',
    height: 101,
    nextMessageId: 4,
    renamingSessionId: 'session-1',
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
    width: 99,
    x: 11,
    y: 22,
  }
  const result = SaveState.saveState(state)
  expect(result.composerValue).toBe('draft')
  expect(result.nextMessageId).toBe(4)
  expect(result.sessions).toEqual(state.sessions)
  expect(result.selectedSessionId).toBe('session-1')
  expect(result.renamingSessionId).toBe('session-1')
  expect(result.viewMode).toBe('list')
  expect(result.x).toBe(11)
  expect(result.y).toBe(22)
  expect(result.width).toBe(99)
  expect(result.height).toBe(101)
})
