import { expect, test } from '@jest/globals'
import * as ClipBoardWorker from '../src/parts/ClipBoardWorker/ClipBoardWorker.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as PasteInput from '../src/parts/PasteInput/PasteInput.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('pasteInput should paste clipboard text into composer', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  ClipBoardWorker.reset()
  await ClipBoardWorker.writeText('hello paste')
  const state = createDefaultState()
  const result = await PasteInput.pasteInput(state)
  expect(result.composerValue).toBe('hello paste')
  expect(result.inputSource).toBe('script')
})
