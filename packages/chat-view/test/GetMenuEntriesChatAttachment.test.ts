import { expect, test } from '@jest/globals'
import * as GetMenuEntriesChatAttachment from '../src/parts/GetMenuEntriesChatAttachment/GetMenuEntriesChatAttachment.ts'

test.skip('getMenuEntriesChatAttachment should expose open and remove actions', () => {
  const entries = GetMenuEntriesChatAttachment.getMenuEntriesChatAttachment('attachment-1', 'data:image/svg+xml;base64,abc')

  expect(entries).toHaveLength(2)
  expect(entries[0]).toMatchObject({
    args: ['data:image/svg+xml;base64,abc'],
    command: 'Chat.openChatAttachmentInNewTab',
    id: 'openImageInNewTab',
    label: 'Open image in new tab',
  })
  expect(entries[1]).toMatchObject({
    args: ['attachment-1'],
    command: 'Chat.removeComposerAttachment',
    id: 'removeAttachment',
    label: 'Remove attachment',
  })
})
