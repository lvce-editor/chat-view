import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ClipBoardWorker from '../src/parts/ClipBoardWorker/ClipBoardWorker.ts'
import * as PasteInput from '../src/parts/PasteInput/PasteInput.ts'

test('pasteInput should paste clipboard text into composer', async () => {
  ClipBoardWorker.reset()
  await ClipBoardWorker.writeText('hello paste')
  const state = createDefaultState()
  const result = await PasteInput.pasteInput(state)
  expect(result.composerValue).toBe('hello paste')
  expect(result.inputSource).toBe('script')
})
