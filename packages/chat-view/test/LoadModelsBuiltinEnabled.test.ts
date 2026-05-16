import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadModelsBuiltinEnabled from '../src/parts/LoadModelsBuiltinEnabled/LoadModelsBuiltinEnabled.ts'

test('loadModelsBuiltinEnabled should return stored boolean value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chat.models.builtin') {
        return false
      }
      return undefined
    },
  })

  const result = await LoadModelsBuiltinEnabled.loadModelsBuiltinEnabled()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.models.builtin']])
})

test('loadModelsBuiltinEnabled should return true when preference is not boolean', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => 'false',
  })

  const result = await LoadModelsBuiltinEnabled.loadModelsBuiltinEnabled()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.models.builtin']])
})

test('loadModelsBuiltinEnabled should return true on preference read error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => {
      throw new Error('failed')
    },
  })

  const result = await LoadModelsBuiltinEnabled.loadModelsBuiltinEnabled()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.models.builtin']])
})
