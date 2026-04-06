import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-attachment-remove'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openMockSession('session-file-attachment-remove', [])

  const attachments = Locator('.ChatComposerAttachments')
  const attachment = Locator('.ChatComposerAttachment')
  const removeButton = Locator('.ChatComposerAttachmentRemoveButton')
  const file = new File([svgContent], 'photo.svg', { type: 'image/svg+xml' })

  await Chat.handleDropFiles(file)

  await expect(attachment).toHaveCount(1)
  await expect(removeButton).toHaveCount(1)

  await removeButton.click()

  await expect(attachments).toHaveCount(0)
  await expect(attachment).toHaveCount(0)
}
