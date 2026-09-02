import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-attachment-remove-aria-label'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'

export const test: Test = async ({ Chat, Command, DragAndDrop, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openMockSession('session-file-attachment-remove-aria-label', [])

  const attachment = Locator('.ChatComposerAttachment')
  const removeButton = Locator('.ChatComposerAttachmentRemoveButton')
  const file = new File([svgContent], 'photo.svg', { type: 'image/svg+xml' })

  const dropId = await DragAndDrop.createDropSession([{ file, kind: 'file', type: file.type }])
  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', dropId)

  await expect(attachment).toHaveCount(1)
  await expect(removeButton).toHaveCount(1)
  await expect(removeButton).toHaveAttribute('title', 'Remove attachment')
}
