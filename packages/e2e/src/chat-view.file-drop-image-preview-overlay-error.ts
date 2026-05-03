import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-drop-image-preview-overlay-error'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openMockSession('session-file-drop-image-preview-overlay-error', [])

  const composer = Locator('.ChatInputBox[name="composer"]')
  const overlay = Locator('.ChatComposerAttachmentPreviewOverlay')
  const overlayImage = Locator('.ChatComposerAttachmentPreviewOverlayImage')
  const overlayError = Locator('.ChatComposerAttachmentPreviewOverlayError')
  const imageFile = new File([svgContent], 'photo.svg', { type: 'image/svg+xml' })

  await expect(composer).toBeVisible()

  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', [imageFile])
  await Command.execute('Chat.showComposerAttachmentPreviewOverlay', 'attachment-1')

  await expect(overlay).toBeVisible()
  await expect(overlayImage).toBeVisible()

  await Command.execute('Chat.handleErrorComposerAttachmentPreviewOverlay')

  await expect(overlayError).toBeVisible()
  await expect(overlayError).toHaveText('Image preview could not be loaded')
}
