import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadUseOwnBackend from '../src/parts/LoadUseOwnBackend/LoadUseOwnBackend.ts'

test('loadUseOwnBackend should return stored boolean value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chat.useOwnBackend') {
        return false
      }
      return undefined
    },
  })

  const result = await LoadUseOwnBackend.loadUseOwnBackend()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.useOwnBackend']])
})

test('loadUseOwnBackend should return true when preference is not boolean', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => 'true',
  })

  const result = await LoadUseOwnBackend.loadUseOwnBackend()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.useOwnBackend']])
})

test('loadUseOwnBackend should return true on preference read error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => {
      throw new Error('failed')
    },
  })

  const result = await LoadUseOwnBackend.loadUseOwnBackend()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.useOwnBackend']])
})