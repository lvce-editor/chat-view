import { expect, test } from '@jest/globals'
import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleInput from '../src/parts/HandleInput/HandleInput.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'

function createState(overrides: Partial<ChatState> = {}): ChatState {
  return {
    ...createDefaultState(),
    ...overrides,
  }
}

test('handleInput should delegate to chat-view-model', async () => {
  const state = createState({
    uid: 7,
  })
  const expectedState = {
    ...state,
    composerSelectionEnd: 5,
    composerSelectionStart: 5,
    composerValue: 'hello',
    inputSource: 'script' as const,
  }
  using mockRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.handleInput': async () => expectedState,
  })

  const result = await HandleInput.handleInput(state, InputName.Composer, 'hello', 'script')

  expect(result).toEqual(expectedState)
  expect(mockRpc.invocations).toEqual([['ChatModel.handleInput', state, InputName.Composer, 'hello', 'script']])
})
