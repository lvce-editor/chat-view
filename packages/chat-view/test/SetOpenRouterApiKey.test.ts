import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetOpenRouterApiKey from '../src/parts/SetOpenRouterApiKey/SetOpenRouterApiKey.ts'

test('setOpenRouterApiKey should update state and persist by default', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetOpenRouterApiKey.setOpenRouterApiKey(state, 'or-key-123')
  expect(result.openRouterApiKey).toBe('or-key-123')
  expect(result.openRouterApiKeyInput).toBe('or-key-123')
  expect(mockRpc.invocations).toEqual([['Preferences.update', { 'secrets.openRouterApiKey': 'or-key-123' }]])
})

test('setOpenRouterApiKey should not persist when persist is false', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetOpenRouterApiKey.setOpenRouterApiKey(state, 'or-key-123', false)
  expect(result.openRouterApiKey).toBe('or-key-123')
  expect(result.openRouterApiKeyInput).toBe('or-key-123')
  expect(mockRpc.invocations).toEqual([])
})
