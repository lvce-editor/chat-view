import { expect, test } from '@jest/globals'
import { ClipBoardWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as PasteInput from '../src/parts/PasteInput/PasteInput.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('pasteInput should paste clipboard text into composer', async () => {
<<<<<<< HEAD
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  ClipBoardWorker.reset()
  await ClipBoardWorker.writeText('hello paste')
=======
  using mockRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.readText': async (text: string) => {
      return 'test'
    },
  })
>>>>>>> origin/main
  const state = createDefaultState()
  const result = await PasteInput.pasteInput(state)
  expect(result.composerValue).toBe('test')
  expect(result.inputSource).toBe('script')
  expect(mockRpc.invocations).toEqual([['ClipBoard.readText']])
})
