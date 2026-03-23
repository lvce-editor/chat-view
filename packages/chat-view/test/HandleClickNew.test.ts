import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickNew } from '../src/parts/HandleClickNew/HandleClickNew.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('handleClickNew should create and select a new session', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = {
    ...createDefaultState(),
    composerValue: 'draft message',
  }

  const result = await handleClickNew(state)

  expect(result.sessions).toHaveLength(state.sessions.length + 1)
  const newSession = result.sessions.at(-1)
  expect(result.selectedSessionId).toBe(newSession?.id)
  expect(newSession?.title).toBe('Chat 2')
  expect(result.composerValue).toBe('')
})
