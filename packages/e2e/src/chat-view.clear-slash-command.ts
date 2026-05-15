import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.clear-slash-command'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.handleInput('message before clear')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(messages).toHaveCount(2)

  // act
  await Chat.handleInput('/clear')
  await Chat.handleSubmit()

  // assert
  await expect(messages).toHaveCount(0)
  await expect(composer).toHaveValue('')
}
