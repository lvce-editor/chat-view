import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadScrollDownButtonEnabled from '../src/parts/LoadScrollDownButtonEnabled/LoadScrollDownButtonEnabled.ts'

test('loadScrollDownButtonEnabled should return stored boolean value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.scrollDownButtonEnabled') {
        return true
      }
      return undefined
    },
  })

  const result = await LoadScrollDownButtonEnabled.loadScrollDownButtonEnabled()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.scrollDownButtonEnabled']])
})

test('loadScrollDownButtonEnabled should return false when preference is not boolean', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => 'true',
  })

  const result = await LoadScrollDownButtonEnabled.loadScrollDownButtonEnabled()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.scrollDownButtonEnabled']])
})

test('loadScrollDownButtonEnabled should return false on preference read error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => {
      throw new Error('failed')
    },
  })

  const result = await LoadScrollDownButtonEnabled.loadScrollDownButtonEnabled()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.scrollDownButtonEnabled']])
})
