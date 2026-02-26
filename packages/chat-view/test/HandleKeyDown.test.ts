import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleKeyDown from '../src/parts/HandleKeyDown/HandleKeyDown.ts'

test('handleKeyDown should submit on Enter', async () => {
  const state = { ...createDefaultState(), composerValue: 'hello' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.sessions[0].messages).toHaveLength(1)
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.composerValue).toBe('')
})

test('handleKeyDown should not submit on Shift+Enter', async () => {
  const state = { ...createDefaultState(), composerValue: 'hello' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', true)
  expect(result).toBe(state)
})

test('handleKeyDown should rename when in rename mode', async () => {
  const state = { ...createDefaultState(), composerValue: 'Renamed Chat', renamingSessionId: 'session-1' }
  const result = await HandleKeyDown.handleKeyDown(state, 'Enter', false)
  expect(result.sessions[0].title).toBe('Renamed Chat')
  expect(result.renamingSessionId).toBe('')
})
