import { expect, test } from '@jest/globals'
import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ComposerAttachment } from '../src/parts/ComposerAttachment/ComposerAttachment.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickBack } from '../src/parts/HandleClickBack/HandleClickBack.ts'

const composerAttachments: readonly ComposerAttachment[] = [
  {
    attachmentId: 'attachment-1',
    displayType: 'file',
    mimeType: 'text/plain',
    name: 'file.txt',
    size: 1,
  },
]

test('handleClickBack should delegate to chat-view-model', async () => {
  const state = {
    ...createDefaultState(),
    composerAttachments,
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

  await handleClickBack(state)

  // expect(result).toEqual(expectedState)
  expect(mockRpc.invocations).toEqual([['ChatModel.handleClickBack', state]])
})
