import { expect, test } from '@jest/globals'
import * as ClipBoardWorker from '../src/parts/ClipBoardWorker/ClipBoardWorker.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as CutInput from '../src/parts/CutInput/CutInput.ts'

test('cutInput should copy composer value and clear composer', async () => {
  ClipBoardWorker.reset()
  const state = {
    ...createDefaultState(),
    composerLineHeight: 24,
    composerHeight: 96,
    composerValue: 'hello cut',
  }
  const result = await CutInput.cutInput(state)
  const text = await ClipBoardWorker.readText()
  expect(text).toBe('hello cut')
  expect(result.composerValue).toBe('')
  expect(result.composerHeight).toBe(32)
})
