import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadModelsTestEnabled from '../src/parts/LoadModelsTestEnabled/LoadModelsTestEnabled.ts'

test('loadModelsTestEnabled should return stored boolean value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chat.models.test') {
        return false
      }
      return undefined
    },
  })

  const result = await LoadModelsTestEnabled.loadModelsTestEnabled()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.models.test']])
})

test('loadModelsTestEnabled should return true when preference is not boolean', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => 'false',
  })

  const result = await LoadModelsTestEnabled.loadModelsTestEnabled()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.models.test']])
})

test('loadModelsTestEnabled should return true on preference read error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => {
      throw new Error('failed')
    },
  })

  const result = await LoadModelsTestEnabled.loadModelsTestEnabled()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.models.test']])
})
