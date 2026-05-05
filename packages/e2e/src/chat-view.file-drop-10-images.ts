import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-drop-10-images'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'

export const skip = 1

const createImageFiles = (count: number): readonly File[] => {
  return Array.from({ length: count }, (_, index) => new File([svgContent], `photo-${index + 1}.svg`, { type: 'image/svg+xml' }))
}

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openMockSession('session-file-drop-10-images', [])

  const composer = Locator('.ChatInputBox[name="composer"]')
  const attachments = Locator('.ChatComposerAttachments')
  const attachment = Locator('.ChatComposerAttachment')
  const files = createImageFiles(10)

  await expect(composer).toBeVisible()

  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', files)

  await expect(attachments).toBeVisible()
  await expect(attachment).toHaveCount(10)

  for (const [index, file] of files.entries()) {
    await expect(attachment.nth(index)).toHaveText(`Image · ${file.name}`)
  }
}
