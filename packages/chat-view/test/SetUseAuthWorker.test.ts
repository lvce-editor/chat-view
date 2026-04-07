import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetUseAuthWorker from '../src/parts/SetUseAuthWorker/SetUseAuthWorker.ts'

test('setUseAuthWorker should update state and persist by default', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetUseAuthWorker.setUseAuthWorker(state, true)
  expect(result.useAuthWorker).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.update', { 'chatView.useAuthWorker': true }]])
})

test('setUseAuthWorker should not persist when persist is false', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetUseAuthWorker.setUseAuthWorker(state, true, false)
  expect(result.useAuthWorker).toBe(true)
  expect(mockRpc.invocations).toEqual([])
})