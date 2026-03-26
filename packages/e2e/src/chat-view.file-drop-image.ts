import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-drop-image'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.openMockSession', 'session-file-drop-image', [])

  const composer = Locator('.ChatInputBox[name="composer"]')
  const attachments = Locator('.ChatComposerAttachments')
  const attachment = Locator('.ChatComposerAttachment')
  const file = new File([svgContent], 'photo.svg', { type: 'image/svg+xml' })

  await expect(composer).toBeVisible()

  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', [file])

  await expect(attachments).toBeVisible()
  await expect(attachment).toHaveCount(1)
  await expect(attachment.first()).toHaveText('Image · photo.svg')
}
