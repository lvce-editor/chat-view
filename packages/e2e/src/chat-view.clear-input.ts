import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.clear-input'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.handleInput('hello from script input')
  await expect(composer).toHaveValue('hello from script input')

  // act
  await Command.execute('Chat.clearInput')

  // assert
  await expect(composer).toHaveValue('')
}
