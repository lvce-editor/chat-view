import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadShowModelUsageMultiplier from '../src/parts/LoadShowModelUsageMultiplier/LoadShowModelUsageMultiplier.ts'

test('loadShowModelUsageMultiplier should return stored boolean value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.showModelUsageMultiplier') {
        return false
      }
      return undefined
    },
  })

  const result = await LoadShowModelUsageMultiplier.loadShowModelUsageMultiplier()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.showModelUsageMultiplier']])
})

test('loadShowModelUsageMultiplier should return true when preference is not boolean', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => 'false',
  })

  const result = await LoadShowModelUsageMultiplier.loadShowModelUsageMultiplier()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.showModelUsageMultiplier']])
})

test('loadShowModelUsageMultiplier should return true on preference read error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => {
      throw new Error('failed')
    },
  })

  const result = await LoadShowModelUsageMultiplier.loadShowModelUsageMultiplier()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.showModelUsageMultiplier']])
})
