import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadUseChatMessageParsingWorker from '../src/parts/LoadUseChatMessageParsingWorker/LoadUseChatMessageParsingWorker.ts'

test('loadUseChatMessageParsingWorker should return stored boolean value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.useChatMessageParsingWorker') {
        return true
      }
      return undefined
    },
  })

  const result = await LoadUseChatMessageParsingWorker.loadUseChatMessageParsingWorker()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.useChatMessageParsingWorker']])
})

test('loadUseChatMessageParsingWorker should return false when preference is not boolean', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => 'true',
  })

  const result = await LoadUseChatMessageParsingWorker.loadUseChatMessageParsingWorker()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.useChatMessageParsingWorker']])
})

test('loadUseChatMessageParsingWorker should return false on preference read error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => {
      throw new Error('failed')
    },
  })

  const result = await LoadUseChatMessageParsingWorker.loadUseChatMessageParsingWorker()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.useChatMessageParsingWorker']])
})
