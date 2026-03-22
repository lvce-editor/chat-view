import { expect, test } from '@jest/globals'
import * as CopyInput from '../src/parts/CopyInput/CopyInput.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('copyInput should copy composer value to clipboard and keep state', async () => {
  const state = {
    ...createDefaultState(),
    composerValue: 'hello copy',
  }
  const result = await CopyInput.copyInput(state)
  expect(text).toBe('hello copy')
  expect(result).toBe(state)
})
