import { expect, test } from '@jest/globals'
import { ChatViewModelWorker, ClipBoardWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as PasteInput from '../src/parts/PasteInput/PasteInput.ts'

test('pasteInput should paste clipboard text into composer', async () => {
  using mockClipboardRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.readText': async (text: string) => {
      return 'test'
    },
  })
  const state = createDefaultState()
  const expectedState = {
    ...state,
    composerSelectionEnd: 4,
    composerSelectionStart: 4,
    composerValue: 'test',
    inputSource: 'script' as const,
  }
  using mockViewModelRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.handleInput': async () => expectedState,
  })

  const result = await PasteInput.pasteInput(state)

  expect(mockClipboardRpc).toBeDefined()
  expect(mockViewModelRpc).toBeDefined()
  expect(result).toEqual(expectedState)
  expect(mockClipboardRpc.invocations).toEqual([['ClipBoard.readText']])
  expect(mockViewModelRpc.invocations).toEqual([['ChatModel.handleInput', state, 'composer', 'test', 'script']])
})
