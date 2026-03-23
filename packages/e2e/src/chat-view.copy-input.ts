import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.copy-input'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.handleInput('copied text')

  await Command.execute('Chat.copyInput')
  await Command.execute('Chat.clearInput')
  await Command.execute('Chat.pasteInput')

  await expect(composer).toHaveValue('copied text')
}
