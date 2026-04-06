import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-drop-image-long-filename'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openMockSession('session-file-drop-image-long-filename', [])

  const composer = Locator('.ChatInputBox[name="composer"]')
  const attachment = Locator('.ChatComposerAttachment')
  const attachmentLabel = Locator('.ChatComposerAttachmentLabel')
  const preview = Locator('.ChatComposerAttachmentPreview')
  const file = new File([svgContent], 'image-with-a-very-long-filename-that-should-still-render-correctly-in-the-chat-composer-preview-state.svg', {
    type: 'image/svg+xml',
  })

  await expect(composer).toBeVisible()

  await Chat.handleDropFiles(file)

  await expect(attachment).toHaveCount(1)
  await expect(attachmentLabel.first()).toHaveText(`Image · ${file.name}`)
  await expect(preview).toHaveCount(1)
}
