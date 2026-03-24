import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Reset from '../src/parts/Reset/Reset.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('reset should clear sessions and composer and switch to list mode', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const withChatList = {
    ...createDefaultState(),
    searchEnabled: true,
    searchFieldVisible: false,
    searchValue: '',
    selectedSessionId: 'session-a',
    sessions: [
      {
        id: 'session-a',
        messages: [],
        title: 'Dummy Chat A',
      },
      {
        id: 'session-b',
        messages: [],
        title: 'Dummy Chat B',
      },
      {
        id: 'session-c',
        messages: [],
        title: 'Dummy Chat C',
      },
    ],
    viewMode: 'list' as const,
  }
  const state = {
    ...withChatList,
    composerSelectionEnd: 5,
    composerSelectionStart: 2,
    composerValue: 'hello',
  }

  const result = await Reset.reset(state)

  expect(result.viewMode).toBe('list')
  expect(result.sessions).toEqual([])
  expect(result.selectedSessionId).toBe('')
  expect(result.composerValue).toBe('')
  expect(result.composerSelectionStart).toBe(0)
  expect(result.composerSelectionEnd).toBe(0)
  expect(result.mockAiResponseDelay).toBe(0)
  expect(result.streamingEnabled).toBe(false)
  expect(result.modelPickerOpen).toBe(false)
  expect(result.modelPickerSearchValue).toBe('')
  expect(result.visibleModels).toBe(result.models)
})
