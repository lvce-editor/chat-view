import { expect, test } from '@jest/globals'
import { appendChatViewEvent } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachments } from '../src/parts/GetComposerAttachments/GetComposerAttachments.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('getComposerAttachments should omit attachments that were removed later', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const blob = new Blob(['hello'], { type: 'text/plain' })

  await appendChatViewEvent({
    attachmentId: 'attachment-1',
    blob,
    mimeType: 'text/plain',
    name: 'notes.txt',
    sessionId: 'session-1',
    size: blob.size,
    timestamp: '2026-03-27T00:00:00.000Z',
    type: 'chat-attachment-added',
  })
  await appendChatViewEvent({
    attachmentId: 'attachment-1',
    sessionId: 'session-1',
    timestamp: '2026-03-27T00:00:01.000Z',
    type: 'chat-attachment-removed',
  })

  const attachments = await getComposerAttachments('session-1')

  expect(attachments).toEqual([])
})
