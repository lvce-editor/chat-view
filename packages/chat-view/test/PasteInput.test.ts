import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as PasteInput from '../src/parts/PasteInput/PasteInput.ts'
import { ClipBoardWorker } from '@lvce-editor/rpc-registry'

test('pasteInput should paste clipboard text into composer', async () => {
  using mockRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {},
  })
  await ClipBoardWorker.writeText('hello paste')
  const state = createDefaultState()
  const result = await PasteInput.pasteInput(state)
  expect(result.composerValue).toBe('hello paste')
  expect(result.inputSource).toBe('script')
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', 'hello copy']])
})
