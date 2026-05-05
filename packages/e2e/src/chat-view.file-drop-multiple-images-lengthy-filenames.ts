import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-drop-multiple-images-lengthy-filenames'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'

const filenames = [
  'multi-image-first-upload-with-a-rather-long-descriptive-filename-for-regression-coverage.svg',
  'multi image second upload with whitespace and a much longer descriptive filename than usual.svg',
  'multi-image-third-upload-😀-with-emoji-and-an-equally-long-descriptive-name-for-rendering.svg',
  'multi-image-fourth-upload-with-extra-details-about-dimensions-and-source-asset-version-2026-03-27.svg',
] as const

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openMockSession('session-file-drop-multiple-images-lengthy-filenames', [])

  const composer = Locator('.ChatInputBox[name="composer"]')
  const attachment = Locator('.ChatComposerAttachment')
  const attachmentLabel = Locator('.ChatComposerAttachmentLabel')
  const preview = Locator('.ChatComposerAttachmentPreview')
  const files = filenames.map((filename) => new File([svgContent], filename, { type: 'image/svg+xml' }))

  await expect(composer).toBeVisible()

  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', files)

  await expect(attachment).toHaveCount(files.length)
  await expect(preview).toHaveCount(files.length)

  for (const [index, file] of files.entries()) {
    await expect(attachmentLabel.nth(index)).toHaveText(`Image · ${file.name}`)
  }
}
