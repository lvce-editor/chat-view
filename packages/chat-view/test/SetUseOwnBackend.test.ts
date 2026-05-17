import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetUseOwnBackend from '../src/parts/SetUseOwnBackend/SetUseOwnBackend.ts'

test('createDefaultState enables useOwnBackend by default', () => {
  const state = CreateDefaultState.createDefaultState()
  expect(state.useOwnBackend).toBe(true)
<<<<<<< HEAD
  expect(state.backendUrl).toBe('https://lvce-editor.dev')
})
=======
})

>>>>>>> origin/main
test('setUseOwnBackend should update state and persist by default', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetUseOwnBackend.setUseOwnBackend(state, true)
  expect(result.useOwnBackend).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.update', { 'chat.useOwnBackend': true }]])
})

test('setUseOwnBackend should not persist when persist is false', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetUseOwnBackend.setUseOwnBackend(state, true, false)
  expect(result.useOwnBackend).toBe(true)
  expect(mockRpc.invocations).toEqual([])
})
