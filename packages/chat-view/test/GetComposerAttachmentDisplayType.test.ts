import { expect, test } from '@jest/globals'
import { getComposerAttachmentDisplayType } from '../src/parts/GetComposerAttachmentDisplayType/GetComposerAttachmentDisplayType.ts'

const createBlob = (content: string, type: string): Blob => {
  return new Blob([content], { type })
}

test('getComposerAttachmentDisplayType returns image for valid image files', async () => {
  const displayType = await getComposerAttachmentDisplayType(
    createBlob('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>', 'image/svg+xml'),
    'photo.svg',
    'image/svg+xml',
  )

  expect(displayType).toBe('image')
})

test('getComposerAttachmentDisplayType returns invalid-image for undecodable image files', async () => {
  const displayType = await getComposerAttachmentDisplayType(createBlob('not-an-image', 'image/png'), 'broken.png', 'image/png')

  expect(displayType).toBe('invalid-image')
})

test('getComposerAttachmentDisplayType returns text-file for txt files', async () => {
  const displayType = await getComposerAttachmentDisplayType(new Blob(['hello'], { type: 'text/plain' }), 'notes.txt', 'text/plain')

  expect(displayType).toBe('text-file')
})
