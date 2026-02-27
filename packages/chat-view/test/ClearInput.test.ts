import { expect, test } from '@jest/globals'
import * as ClearInput from '../src/parts/ClearInput/ClearInput.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('clearInput should clear composer value', async () => {
  const state = {
    ...createDefaultState(),
    composerValue: 'hello',
  }
  const result = await ClearInput.clearInput(state)
  expect(result.composerValue).toBe('')
})
