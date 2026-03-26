import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-drop-text-file'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.openMockSession', 'session-file-drop-text-file', [])

  const composer = Locator('.ChatInputBox[name="composer"]')
  const attachments = Locator('.ChatComposerAttachments')
  const attachment = Locator('.ChatComposerAttachment')
  const file = new File(['hello from text file'], 'notes.txt', { type: 'text/plain' })

  await expect(composer).toBeVisible()

  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', [file])

  await expect(attachments).toBeVisible()
  await expect(attachment).toHaveCount(1)
  await expect(attachment.first()).toHaveText('Text file · notes.txt')
}
