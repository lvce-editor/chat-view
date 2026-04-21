import { expect, test } from '@jest/globals'
import { appendChatViewEvent } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachments } from '../src/parts/GetComposerAttachments/GetComposerAttachments.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

const imagePreviewSrcRegex = /^data:image\/svg\+xml;base64,/

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

test('getComposerAttachments restores preview src for valid images only', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const imageBlob = new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'], { type: 'image/svg+xml' })
  const textBlob = new Blob(['hello'], { type: 'text/plain' })

  await appendChatViewEvent({
    attachmentId: 'attachment-1',
    blob: imageBlob,
    mimeType: 'image/svg+xml',
    name: 'photo.svg',
    sessionId: 'session-1',
    size: imageBlob.size,
    timestamp: '2026-03-27T00:00:00.000Z',
    type: 'chat-attachment-added',
  })
  await appendChatViewEvent({
    attachmentId: 'attachment-2',
    blob: textBlob,
    mimeType: 'text/plain',
    name: 'notes.txt',
    sessionId: 'session-1',
    size: textBlob.size,
    timestamp: '2026-03-27T00:00:01.000Z',
    type: 'chat-attachment-added',
  })

  const attachments = await getComposerAttachments('session-1')

  expect(attachments).toHaveLength(2)
  expect(attachments[0]).toEqual(
    expect.objectContaining({
      attachmentId: 'attachment-1',
      displayType: 'image',
      previewSrc: expect.stringMatching(imagePreviewSrcRegex),
    }),
  )
  expect(attachments[1]).toEqual(
    expect.objectContaining({
      attachmentId: 'attachment-2',
      displayType: 'text-file',
      textContent: 'hello',
    }),
  )
  expect(attachments[1]).not.toHaveProperty('previewSrc')
})
