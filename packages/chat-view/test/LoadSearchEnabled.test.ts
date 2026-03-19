import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadSearchEnabled from '../src/parts/LoadSearchEnabled/LoadSearchEnabled.ts'

test('loadSearchEnabled should return stored boolean value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.searchEnabled') {
        return true
      }
      return undefined
    },
  })

  const result = await LoadSearchEnabled.loadSearchEnabled()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.searchEnabled']])
})

test('loadSearchEnabled should return false when preference is not boolean', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => 'true',
  })

  const result = await LoadSearchEnabled.loadSearchEnabled()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.searchEnabled']])
})

test('loadSearchEnabled should return false on preference read error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => {
      throw new Error('failed')
    },
  })

  const result = await LoadSearchEnabled.loadSearchEnabled()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.searchEnabled']])
})
