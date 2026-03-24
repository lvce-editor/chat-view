import { expect, test } from '@jest/globals'
import { ClipBoardWorker } from '@lvce-editor/rpc-registry'
import * as CopyInput from '../src/parts/CopyInput/CopyInput.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('copyInput should copy composer value to clipboard and keep state', async () => {
  using mockRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {},
  })
  const state = {
    ...createDefaultState(),
    composerSelectionEnd: 10,
    composerSelectionStart: 0,
    composerValue: 'hello copy',
  }
  const result = await CopyInput.copyInput(state)
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', 'hello copy']])
})

test('copyInput should copy selected composer range', async () => {
  using mockRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {},
  })
  const state = {
    ...createDefaultState(),
    composerSelectionEnd: 6,
    composerSelectionStart: 0,
    composerValue: 'hello copy',
  }
  await CopyInput.copyInput(state)
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', 'hello ']])
})
