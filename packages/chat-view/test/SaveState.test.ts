import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SaveState from '../src/parts/SaveState/SaveState.ts'

test('saveState should persist chat sessions and composer value', () => {
  const state: ChatState = {
    ...createDefaultState(),
    composerValue: 'draft',
    nextMessageId: 4,
    renamingSessionId: 'session-1',
  }
  const result = SaveState.saveState(state)
  expect(result.composerValue).toBe('draft')
  expect(result.nextMessageId).toBe(4)
  expect(result.sessions).toEqual(state.sessions)
  expect(result.selectedSessionId).toBe('session-1')
  expect(result.renamingSessionId).toBe('session-1')
})
