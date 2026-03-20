import { expect, test } from '@jest/globals'
import * as ClipBoardWorker from '../src/parts/ClipBoardWorker/ClipBoardWorker.ts'
import * as CopyInput from '../src/parts/CopyInput/CopyInput.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('copyInput should copy composer value to clipboard and keep state', async () => {
  ClipBoardWorker.reset()
  const state = {
    ...createDefaultState(),
    composerValue: 'hello copy',
  }
  const result = await CopyInput.copyInput(state)
  const text = await ClipBoardWorker.readText()
  expect(text).toBe('hello copy')
  expect(result).toBe(state)
})
