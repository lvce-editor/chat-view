import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.image-attachment-context-menu-entries'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.openMockSession', 'session-image-attachment-context-menu-entries', [])

  const imageFile = new File([svgContent], 'photo.svg', { type: 'image/svg+xml' })
  const preview = Locator('.ChatComposerAttachmentPreview')
  const openMenuItem = Locator('.MenuItem').nth(0)
  const removeMenuItem = Locator('.MenuItem').nth(1)

  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', [imageFile])
  await expect(preview).toBeVisible()

  await Command.execute('Chat.handleContextMenuChatImageAttachment', '', 0, 0)

  await expect(openMenuItem).toBeVisible()
  await expect(openMenuItem).toHaveText('Open image in new tab')
  await expect(removeMenuItem).toBeVisible()
  await expect(removeMenuItem).toHaveText('Remove attachment')
}