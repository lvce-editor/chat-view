import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetUseChatNetworkWorkerForRequests from '../src/parts/SetUseChatNetworkWorkerForRequests/SetUseChatNetworkWorkerForRequests.ts'

test('setUseChatNetworkWorkerForRequests should update state and persist by default', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetUseChatNetworkWorkerForRequests.setUseChatNetworkWorkerForRequests(state, true)
  expect(result.useChatNetworkWorkerForRequests).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.update', { 'chatView.useChatNetworkWorkerForRequests': true }]])
})

test('setUseChatNetworkWorkerForRequests should not persist when persist is false', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetUseChatNetworkWorkerForRequests.setUseChatNetworkWorkerForRequests(state, true, false)
  expect(result.useChatNetworkWorkerForRequests).toBe(true)
  expect(mockRpc.invocations).toEqual([])
})
