import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetUseChatCoordinatorWorker from '../src/parts/SetUseChatCoordinatorWorker/SetUseChatCoordinatorWorker.ts'

test('setUseChatCoordinatorWorker should update state and persist by default', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetUseChatCoordinatorWorker.setUseChatCoordinatorWorker(state, true)
  expect(result.useChatCoordinatorWorker).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.update', { 'chatView.useChatCoordinatorWorker': true }]])
})

test('setUseChatCoordinatorWorker should not persist when persist is false', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetUseChatCoordinatorWorker.setUseChatCoordinatorWorker(state, true, false)
  expect(result.useChatCoordinatorWorker).toBe(true)
  expect(mockRpc.invocations).toEqual([])
})
