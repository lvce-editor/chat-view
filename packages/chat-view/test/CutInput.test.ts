import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as CutInput from '../src/parts/CutInput/CutInput.ts'

test('cutInput should copy composer value and clear composer', async () => {
  const state = {
    ...createDefaultState(),
    composerHeight: 96,
    composerLineHeight: 24,
    composerValue: 'hello cut',
  }
  const result = await CutInput.cutInput(state)
  expect(result.composerValue).toBe('')
  expect(result.composerHeight).toBe(32)
})
