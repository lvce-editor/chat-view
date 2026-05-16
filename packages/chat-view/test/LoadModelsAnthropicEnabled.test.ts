import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadModelsAnthropicEnabled from '../src/parts/LoadModelsAnthropicEnabled/LoadModelsAnthropicEnabled.ts'

test('loadModelsAnthropicEnabled should return stored boolean value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chat.models.anthropic') {
        return true
      }
      return undefined
    },
  })

  const result = await LoadModelsAnthropicEnabled.loadModelsAnthropicEnabled()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.models.anthropic']])
})

test('loadModelsAnthropicEnabled should return false when preference is not boolean', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => 'true',
  })

  const result = await LoadModelsAnthropicEnabled.loadModelsAnthropicEnabled()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.models.anthropic']])
})

test('loadModelsAnthropicEnabled should return false on preference read error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => {
      throw new Error('failed')
    },
  })

  const result = await LoadModelsAnthropicEnabled.loadModelsAnthropicEnabled()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.models.anthropic']])
})
