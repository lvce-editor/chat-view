import { expect, test } from '@jest/globals'
import * as CopyInput from '../src/parts/CopyInput/CopyInput.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { ClipBoardWorker } from '@lvce-editor/rpc-registry'

test('copyInput should copy composer value to clipboard and keep state', async () => {
  using mockRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.writeText'() {},
  })
  const state = {
    ...createDefaultState(),
    composerValue: 'hello copy',
  }
  const result = await CopyInput.copyInput(state)
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', 'hello copy']])
  expect(result).toBe(state)
})
