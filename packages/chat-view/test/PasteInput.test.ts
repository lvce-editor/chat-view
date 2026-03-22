import { expect, test } from '@jest/globals'
import { ClipBoardWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as PasteInput from '../src/parts/PasteInput/PasteInput.ts'

test('pasteInput should paste clipboard text into composer', async () => {
  using mockRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.readText': async (text: string) => {
      return 'test'
    },
  })
  const state = createDefaultState()
  const result = await PasteInput.pasteInput(state)
  expect(result.composerValue).toBe('hello paste')
  expect(result.inputSource).toBe('script')
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', 'hello copy']])
})
