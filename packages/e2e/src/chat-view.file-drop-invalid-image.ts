import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-drop-invalid-image'

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openMockSession('session-file-drop-invalid-image', [])

  const composer = Locator('.ChatInputBox[name="composer"]')
  const attachments = Locator('.ChatComposerAttachments')
  const attachment = Locator('.ChatComposerAttachment')
  const file = new File(['not-a-real-png'], 'broken.png', { type: 'image/png' })

  await expect(composer).toBeVisible()

  // @ts-ignore
  await Chat.handleDropFiles(file)

  await expect(attachments).toBeVisible()
  await expect(attachment).toHaveCount(1)
  await expect(attachment.first()).toHaveText('xInvalid image · broken.png')
}
