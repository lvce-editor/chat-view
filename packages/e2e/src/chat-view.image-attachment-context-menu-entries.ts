import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.image-attachment-context-menu-entries'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openMockSession('session-image-attachment-context-menu-entries', [])

  const imageFile = new File([svgContent], 'photo.svg', { type: 'image/svg+xml' })
  const preview = Locator('.ChatComposerAttachmentPreview')
  const openMenuItem = Locator('.MenuItem').nth(0)
  const removeMenuItem = Locator('.MenuItem').nth(1)

  // @ts-ignore
  await Chat.handleDropFiles(imageFile)
  await expect(preview).toBeVisible()

  await Chat.handleContextMenuChatImageAttachment('', 0, 0)

  await expect(openMenuItem).toBeVisible()
  await expect(openMenuItem).toHaveText('Open image in new tab')
  await expect(removeMenuItem).toBeVisible()
  await expect(removeMenuItem).toHaveText('Remove attachment')
}
