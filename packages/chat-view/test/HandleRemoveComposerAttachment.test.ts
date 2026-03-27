import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleRemoveComposerAttachment from '../src/parts/HandleRemoveComposerAttachment/HandleRemoveComposerAttachment.ts'

test('handleRemoveComposerAttachment should remove the attachment and update layout height', async () => {
  const state = {
    ...createDefaultState(),
    composerAttachments: [
      {
        attachmentId: 'attachment-1',
        displayType: 'image' as const,
        mimeType: 'image/svg+xml',
        name: 'photo.svg',
        previewSrc: 'data:image/svg+xml;base64,abc',
        size: 10,
      },
    ],
    composerAttachmentsHeight: 34,
    selectedSessionId: '',
    width: 500,
  }

  const result = await HandleRemoveComposerAttachment.handleRemoveComposerAttachment(state, 'attachment-1')

  expect(result.composerAttachments).toEqual([])
  expect(result.composerAttachmentsHeight).toBe(0)
})
