import { expect, test } from '@jest/globals'
import { getComposerAttachmentPreviewSrc } from '../src/parts/GetComposerAttachmentPreviewSrc/GetComposerAttachmentPreviewSrc.ts'

test('getComposerAttachmentPreviewSrc returns undefined for non-image attachments', async () => {
  const result = await getComposerAttachmentPreviewSrc(new Blob(['hello'], { type: 'text/plain' }), 'text-file', 'text/plain')

  expect(result).toBeUndefined()
})

test('getComposerAttachmentPreviewSrc returns a data url for image attachments', async () => {
  const result = await getComposerAttachmentPreviewSrc(new Blob(['<svg/>'], { type: 'image/svg+xml' }), 'image', 'image/svg+xml')

  expect(result).toBe('data:image/svg+xml;base64,PHN2Zy8+')
})

test('getComposerAttachmentPreviewSrc falls back to application/octet-stream when mime type is missing', async () => {
  const result = await getComposerAttachmentPreviewSrc(new Blob(['hello']), 'image', '')

  expect(result).toBe('data:application/octet-stream;base64,aGVsbG8=')
})
