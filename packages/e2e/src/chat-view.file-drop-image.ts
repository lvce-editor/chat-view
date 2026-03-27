import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-drop-image'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'
const svgPreviewSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg=='

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.openMockSession', 'session-file-drop-image', [])

  const composer = Locator('.ChatInputBox[name="composer"]')
  const attachments = Locator('.ChatComposerAttachments')
  const attachment = Locator('.ChatComposerAttachment')
  const imageAttachment = attachment.nth(0)
  const textAttachment = attachment.nth(1)
  const previews = Locator('.ChatComposerAttachmentPreview')
  const imageFile = new File([svgContent], 'photo.svg', { type: 'image/svg+xml' })
  const textFile = new File(['hello from text file'], 'notes.txt', { type: 'text/plain' })

  await expect(composer).toBeVisible()

  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', [imageFile, textFile])

  await expect(attachments).toBeVisible()
  await expect(attachment).toHaveCount(2)
  await expect(imageAttachment).toHaveText('xImage · photo.svg')
  await expect(textAttachment).toHaveText('Text file · notes.txt')
  await expect(previews).toHaveCount(1)
  await expect(imageAttachment.locator('.ChatComposerAttachmentPreview')).toHaveCount(1)
  await expect(imageAttachment.locator('.ChatComposerAttachmentPreview')).toHaveAttribute('src', svgPreviewSrc)
  await expect(textAttachment.locator('.ChatComposerAttachmentPreview')).toHaveCount(0)
}
