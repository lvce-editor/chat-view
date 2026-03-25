import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetUseChatMessageParsingWorker from '../src/parts/SetUseChatMessageParsingWorker/SetUseChatMessageParsingWorker.ts'

test('setUseChatMessageParsingWorker should update state and persist by default', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  expect(state.useChatMessageParsingWorker).toBe(false)
  const result = await SetUseChatMessageParsingWorker.setUseChatMessageParsingWorker(state, true)
  expect(result.useChatMessageParsingWorker).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.update', { 'chatView.useChatMessageParsingWorker': true }]])
})

test('setUseChatMessageParsingWorker should not persist when persist is false', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetUseChatMessageParsingWorker.setUseChatMessageParsingWorker(state, true, false)
  expect(result.useChatMessageParsingWorker).toBe(true)
  expect(mockRpc.invocations).toEqual([])
})
