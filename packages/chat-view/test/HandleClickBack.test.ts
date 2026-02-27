import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickBack } from '../src/parts/HandleClickBack/HandleClickBack.ts'

test('handleClickBack should go back to list mode', async () => {
  const state = {
    ...createDefaultState(),
    renamingSessionId: 'session-1',
    viewMode: 'detail' as const,
  }

  const result = await handleClickBack(state)

  expect(result.viewMode).toBe('list')
  expect(result.renamingSessionId).toBe('')
})
