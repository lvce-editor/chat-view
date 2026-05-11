import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-input-multiple-characters'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  // act
  await Chat.handleInput('a')
  await Chat.handleInput('ab')
  await Chat.handleInput('abc')
  await Chat.handleInput('abcd')

  // assert
  await expect(composer).toHaveValue('abcd')
}
