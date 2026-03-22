import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.cut-input'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.handleInput('cut text')

  await Command.execute('Chat.cutInput')
  await expect(composer).toHaveValue('')

  await Command.execute('Chat.pasteInput')
  await expect(composer).toHaveValue('cut text')
}
