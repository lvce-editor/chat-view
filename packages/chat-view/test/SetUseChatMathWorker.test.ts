import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetUseChatMathWorker from '../src/parts/SetUseChatMathWorker/SetUseChatMathWorker.ts'

test('setUseChatMathWorker should update state and persist by default', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetUseChatMathWorker.setUseChatMathWorker(state, true)
  expect(result.useChatMathWorker).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.update', { 'chatView.useChatMathWorker': true }]])
})

test('setUseChatMathWorker should not persist when persist is false', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetUseChatMathWorker.setUseChatMathWorker(state, true, false)
  expect(result.useChatMathWorker).toBe(true)
  expect(mockRpc.invocations).toEqual([])
})
