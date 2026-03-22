import { expect, test } from '@jest/globals'
import { ClipBoardWorker } from '@lvce-editor/rpc-registry'
import * as CopyInput from '../src/parts/CopyInput/CopyInput.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('copyInput should copy composer value to clipboard and keep state', async () => {
  using mockRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.writeText'() {},
  })
  const state = {
    ...createDefaultState(),
    composerValue: 'hello copy',
  }
  const result = await CopyInput.copyInput(state)
  expect(mockRpc.invocations).toEqual([[]])
  expect(result).toBe(state)
})
