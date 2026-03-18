import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadUseChatToolWorker from '../src/parts/LoadUseChatToolWorker/LoadUseChatToolWorker.ts'

test('loadUseChatToolWorker should return stored boolean value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.useChatToolWorker') {
        return true
      }
      return undefined
    },
  })

  const result = await LoadUseChatToolWorker.loadUseChatToolWorker()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.useChatToolWorker']])
})

test('loadUseChatToolWorker should return true when preference is not boolean', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => 'true',
  })

  const result = await LoadUseChatToolWorker.loadUseChatToolWorker()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.useChatToolWorker']])
})

test('loadUseChatToolWorker should return true on preference read error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => {
      throw new Error('failed')
    },
  })

  const result = await LoadUseChatToolWorker.loadUseChatToolWorker()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.useChatToolWorker']])
})
