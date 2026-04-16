import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadRunModePickerEnabled from '../src/parts/LoadRunModePickerEnabled/LoadRunModePickerEnabled.ts'

test('loadRunModePickerEnabled should return stored boolean value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.runModePickerEnabled') {
        return false
      }
      return undefined
    },
  })

  const result = await LoadRunModePickerEnabled.loadRunModePickerEnabled()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.runModePickerEnabled']])
})

test('loadRunModePickerEnabled should return true when preference is not boolean', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => 'false',
  })

  const result = await LoadRunModePickerEnabled.loadRunModePickerEnabled()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.runModePickerEnabled']])
})

test('loadRunModePickerEnabled should return true on preference read error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => {
      throw new Error('failed')
    },
  })

  const result = await LoadRunModePickerEnabled.loadRunModePickerEnabled()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.runModePickerEnabled']])
})
