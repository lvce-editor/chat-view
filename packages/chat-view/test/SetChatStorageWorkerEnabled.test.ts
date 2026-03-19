import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetChatStorageWorkerEnabled from '../src/parts/SetChatStorageWorkerEnabled/SetChatStorageWorkerEnabled.ts'

test('setChatStorageWorkerEnabled should update state and persist by default', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  try {
    const state = CreateDefaultState.createDefaultState()
    const result = await SetChatStorageWorkerEnabled.setChatStorageWorkerEnabled(state, true)
    expect(result.chatStorageWorkerEnabled).toBe(true)
    expect(mockRpc.invocations).toEqual([['Preferences.update', { 'chatView.chatStorageWorkerEnabled': true }]])
  } finally {
    ;(mockRpc as { [Symbol.dispose]?: () => void })[Symbol.dispose]?.()
  }
})

test('setChatStorageWorkerEnabled should not persist when persist is false', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  try {
    const state = CreateDefaultState.createDefaultState()
    const result = await SetChatStorageWorkerEnabled.setChatStorageWorkerEnabled(state, true, false)
    expect(result.chatStorageWorkerEnabled).toBe(true)
    expect(mockRpc.invocations).toEqual([])
  } finally {
    ;(mockRpc as { [Symbol.dispose]?: () => void })[Symbol.dispose]?.()
  }
})
