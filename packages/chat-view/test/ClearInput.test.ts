import { expect, test } from '@jest/globals'
import * as ClearInput from '../src/parts/ClearInput/ClearInput.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('clearInput should clear composer value', async () => {
  const state = {
    ...createDefaultState(),
    composerSelectionEnd: 4,
    composerSelectionStart: 1,
    composerValue: 'hello',
  }
  const result = await ClearInput.clearInput(state)
  expect(result.composerValue).toBe('')
  expect(result.composerSelectionStart).toBe(0)
  expect(result.composerSelectionEnd).toBe(0)
})
