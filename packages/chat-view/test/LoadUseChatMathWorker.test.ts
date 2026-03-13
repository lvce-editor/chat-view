import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadUseChatMathWorker from '../src/parts/LoadUseChatMathWorker/LoadUseChatMathWorker.ts'

test('loadUseChatMathWorker should return stored boolean value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.useChatMathWorker') {
        return true
      }
      return undefined
    },
  })

  const result = await LoadUseChatMathWorker.loadUseChatMathWorker()
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.useChatMathWorker']])
})

test('loadUseChatMathWorker should return false when preference is not boolean', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => 'true',
  })

  const result = await LoadUseChatMathWorker.loadUseChatMathWorker()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.useChatMathWorker']])
})

test('loadUseChatMathWorker should return false on preference read error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => {
      throw new Error('failed')
    },
  })

  const result = await LoadUseChatMathWorker.loadUseChatMathWorker()
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.useChatMathWorker']])
})
