import { expect, test } from '@jest/globals'
import { ChatStorageWorker, ClipBoardWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as PasteInput from '../src/parts/PasteInput/PasteInput.ts'

test('pasteInput should paste clipboard text into composer', async () => {
  using mockRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.readText': async (text: string) => {
      return 'test'
    },
  })
  using mockRpc2 = ChatStorageWorker.registerMockRpc({
    'ChatStorage.appendEvent'() {},
  })
  const state = createDefaultState()
  const result = await PasteInput.pasteInput(state)
  expect(result.composerValue).toBe('test')
  expect(result.inputSource).toBe('script')
  expect(mockRpc.invocations).toEqual([['ClipBoard.readText']])
  expect(mockRpc2.invocations).toEqual([
    [
      'ChatStorage.appendEvent',
      {
        sessionId: 'session-1',
        timestamp: expect.any(String),
        type: 'handle-input',
        value: 'test',
      },
    ],
  ])
})
