import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-drop-large-text-file'

const megabyte = 1024 * 1024
const fileSizeInMegabytes = 100

const createLargeTextFile = (): File => {
  const oneMegabyteChunk = new TextEncoder().encode('a'.repeat(megabyte))
  const chunks = Array.from<BlobPart>({ length: fileSizeInMegabytes }).fill(oneMegabyteChunk)
  return new File(chunks, 'large-notes.txt', { type: 'text/plain' })
}

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openMockSession('session-file-drop-large-text-file', [])

  const composer = Locator('.ChatInputBox[name="composer"]')
  const attachments = Locator('.ChatComposerAttachments')
  const attachment = Locator('.ChatComposerAttachment')
  const file = createLargeTextFile()

  await expect(composer).toBeVisible()

  await Chat.handleDropFiles(file)

  await expect(attachments).toBeVisible()
  await expect(attachment).toHaveCount(1)
  await expect(attachment.first()).toHaveText('xText file · large-notes.txt')
}
