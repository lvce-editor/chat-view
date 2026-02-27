import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ClearInput from '../src/parts/ClearInput/ClearInput.ts'

test('clearInput should clear composer value', async () => {
  const state = {
    ...createDefaultState(),
    composerValue: 'hello',
  }
  const result = await ClearInput.clearInput(state)
  expect(result.composerValue).toBe('')
})
