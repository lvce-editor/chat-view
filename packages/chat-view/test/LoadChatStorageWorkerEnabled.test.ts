import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadChatStorageWorkerEnabled from '../src/parts/LoadChatStorageWorkerEnabled/LoadChatStorageWorkerEnabled.ts'

test('loadChatStorageWorkerEnabled should return stored boolean value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chatView.chatStorageWorkerEnabled') {
        return true
      }
      return undefined
    },
  })

  try {
    const result = await LoadChatStorageWorkerEnabled.loadChatStorageWorkerEnabled()
    expect(result).toBe(true)
    expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.chatStorageWorkerEnabled']])
  } finally {
    ;(mockRpc as { [Symbol.dispose]?: () => void })[Symbol.dispose]?.()
  }
})

test('loadChatStorageWorkerEnabled should return false when preference is not boolean', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => 'true',
  })

  try {
    const result = await LoadChatStorageWorkerEnabled.loadChatStorageWorkerEnabled()
    expect(result).toBe(false)
    expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.chatStorageWorkerEnabled']])
  } finally {
    ;(mockRpc as { [Symbol.dispose]?: () => void })[Symbol.dispose]?.()
  }
})

test('loadChatStorageWorkerEnabled should return false on preference read error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => {
      throw new Error('failed')
    },
  })

  try {
    const result = await LoadChatStorageWorkerEnabled.loadChatStorageWorkerEnabled()
    expect(result).toBe(false)
    expect(mockRpc.invocations).toEqual([['Preferences.get', 'chatView.chatStorageWorkerEnabled']])
  } finally {
    ;(mockRpc as { [Symbol.dispose]?: () => void })[Symbol.dispose]?.()
  }
})
