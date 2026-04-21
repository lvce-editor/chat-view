import { expect, test } from '@jest/globals'
import { getComposerAttachmentsHeight } from '../src/parts/GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'

test('getComposerAttachmentsHeight should return 0 for empty attachments', () => {
  expect(getComposerAttachmentsHeight([], 400)).toBe(0)
})

test('getComposerAttachmentsHeight should grow when attachment chips wrap', () => {
  const attachments = [
    {
      attachmentId: 'attachment-1',
      displayType: 'text-file' as const,
      mimeType: 'text/plain',
      name: 'a.txt',
      size: 1,
    },
    {
      attachmentId: 'attachment-2',
      displayType: 'text-file' as const,
      mimeType: 'text/plain',
      name: 'b.txt',
      size: 1,
    },
    {
      attachmentId: 'attachment-3',
      displayType: 'text-file' as const,
      mimeType: 'text/plain',
      name: 'c.txt',
      size: 1,
    },
  ]

  const wideHeight = getComposerAttachmentsHeight(attachments, 700)
  const narrowHeight = getComposerAttachmentsHeight(attachments, 140)

  expect(wideHeight).toBeGreaterThan(0)
  expect(narrowHeight).toBeGreaterThan(wideHeight)
})
