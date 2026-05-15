import { expect, test } from '@jest/globals'
import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickBack } from '../src/parts/HandleClickBack/HandleClickBack.ts'

test('handleClickBack should delegate to chat-view-model', async () => {
  const state = {
    ...createDefaultState(),
    composerAttachments: [{ id: 'attachment-1', name: 'file.txt', type: 'file', uri: 'file:///workspace/file.txt' }],
    composerAttachmentsHeight: 56,
    lastNormalViewMode: 'detail' as const,
    renamingSessionId: 'session-1',
    viewMode: 'detail' as const,
  }
  const expectedState = {
    ...state,
    composerAttachments: [],
    composerAttachmentsHeight: 0,
    lastNormalViewMode: 'list' as const,
    renamingSessionId: '',
    viewMode: 'list' as const,
  }
  using mockRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.handleClickBack': async () => expectedState,
  })

  const result = await handleClickBack(state)

  expect(result).toEqual(expectedState)
  expect(mockRpc.invocations).toEqual([['ChatModel.handleClickBack', state]])
})
