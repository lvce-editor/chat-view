import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-attachment-remove-aria-label'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openMockSession('session-file-attachment-remove-aria-label', [])

  const attachment = Locator('.ChatComposerAttachment')
  const removeButton = Locator('.ChatComposerAttachmentRemoveButton')
  const file = new File([svgContent], 'photo.svg', { type: 'image/svg+xml' })

  // @ts-ignore
  await Chat.handleDropFiles(file)

  await expect(attachment).toHaveCount(1)
  await expect(removeButton).toHaveCount(1)
  await expect(removeButton).toHaveAttribute('aria-label', 'Remove attachment')
}
