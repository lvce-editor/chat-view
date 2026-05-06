import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-drop-image-preview-overlay'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'
const svgPreviewSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg=='

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openMockSession('session-file-drop-image-preview-overlay', [])

  const overlay = Locator('.ChatComposerAttachmentPreviewOverlay')
  const overlayImage = Locator('.ChatComposerAttachmentPreviewOverlayImage')
  const composer = Locator('.ChatInputBox[name="composer"]')
  const imageFile = new File([svgContent], 'photo.svg', { type: 'image/svg+xml' })

  await expect(composer).toBeVisible()

  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', [imageFile])
  await Command.execute('Chat.showComposerAttachmentPreviewOverlay', 'attachment-1')

  await expect(overlay).toBeVisible()
  await expect(overlayImage).toBeVisible()
  await expect(overlayImage).toHaveAttribute('src', svgPreviewSrc)

  await Command.execute('Chat.hideComposerAttachmentPreviewOverlay')

  await expect(overlay).toBeHidden()
}
