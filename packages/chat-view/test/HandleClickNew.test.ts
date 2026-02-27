import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickNew } from '../src/parts/HandleClickNew/HandleClickNew.ts'

test('handleClickNew should create and select a new session', async () => {
  const state = createDefaultState()

  const result = await handleClickNew(state)

  expect(result.sessions).toHaveLength(state.sessions.length + 1)
  const newSession = result.sessions.at(-1)
  expect(result.selectedSessionId).toBe(newSession?.id)
  expect(newSession?.title).toBe('Chat 2')
})
