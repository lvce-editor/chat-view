import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { loadPreferences } from '../src/parts/LoadPreferences/LoadPreferences.ts'

test('loadPreferences enables useOwnBackend by default', async () => {
  using _ = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      switch (key) {
        case 'chat.chatHistoryEnabled':
        case 'chatView.composerDropEnabled':
        case 'chatView.runModePickerEnabled':
        case 'chatView.showChatListTime':
        case 'chatView.showModelUsageMultiplier':
        case 'chatView.streamingEnabled':
        case 'chatView.useChatCoordinatorWorker':
        case 'chatView.useChatMathWorker':
        case 'chatView.useChatToolWorker':
          return undefined
        default:
          return undefined
      }
    },
  })

  const result = await loadPreferences()
  expect(result.useOwnBackend).toBe(true)
})

test('loadPreferences keeps explicit useOwnBackend disablement', async () => {
  using _ = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chat.useOwnBackend') {
        return false
      }
      return undefined
    },
  })

  const result = await loadPreferences()
  expect(result.useOwnBackend).toBe(false)
})
