import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadSessionPinningEnabled from '../src/parts/LoadSessionPinningEnabled/LoadSessionPinningEnabled.ts'

test('loadSessionPinningEnabled should return stored boolean value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chat.sessionPinningEnabled') {
        return false
      }
      return undefined
    },
  })

  const result = await LoadSessionPinningEnabled.loadSessionPinningEnabled()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.sessionPinningEnabled']])
})

test('loadSessionPinningEnabled should return true when preference is not boolean', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => 'false',
  })

  const result = await LoadSessionPinningEnabled.loadSessionPinningEnabled()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.sessionPinningEnabled']])
})

test('loadSessionPinningEnabled should return true on preference read error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => {
      throw new Error('failed')
    },
  })

  const result = await LoadSessionPinningEnabled.loadSessionPinningEnabled()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.sessionPinningEnabled']])
})
