import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-drop-same-image-twice'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'
const svgPreviewSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg=='

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openMockSession('session-file-drop-same-image-twice', [])

  const composer = Locator('.ChatInputBox[name="composer"]')
  const attachments = Locator('.ChatComposerAttachments')
  const attachment = Locator('.ChatComposerAttachment')
  const previews = Locator('.ChatComposerAttachmentPreview')
  const imageFile = new File([svgContent], 'photo.svg', { type: 'image/svg+xml' })

  await expect(composer).toBeVisible()

  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', [imageFile])
  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', [imageFile])

  await expect(attachments).toBeVisible()
  await expect(attachment).toHaveCount(2)
  await expect(previews).toHaveCount(2)
  const attachment0 = attachment.nth(0)
  await expect(attachment0).toHaveText('xImage · photo.svg')
  const attachment1 = attachment.nth(1)
  await expect(attachment1).toHaveText('xImage · photo.svg')
  const attachment0Preview = attachment0.locator('.ChatComposerAttachmentPreview')
  await expect(attachment0Preview).toHaveAttribute('src', svgPreviewSrc)
  const attachment1Preview = attachment1.locator('.ChatComposerAttachmentPreview')
  await expect(attachment1Preview).toHaveAttribute('src', svgPreviewSrc)
}
