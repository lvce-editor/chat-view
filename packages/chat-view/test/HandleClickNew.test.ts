import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickNew } from '../src/parts/HandleClickNew/HandleClickNew.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('handleClickNew should clear input, focus composer and switch to list mode without creating a new session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = {
    ...createDefaultState(),
    composerValue: 'draft message',
    focused: false,
    lastNormalViewMode: 'detail' as const,
    viewMode: 'detail' as const,
  }

  const result = await handleClickNew(state)

  expect(result.sessions).toHaveLength(state.sessions.length)
  expect(result.selectedSessionId).toBe('')
  expect(result.composerValue).toBe('')
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
  expect(result.lastNormalViewMode).toBe('list')
  expect(result.viewMode).toBe('list')
})
