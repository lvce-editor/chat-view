import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.clear-input'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.handleInput('hello from script input')
  await expect(composer).toHaveValue('hello from script input')

  // act
  await Chat.clearInput()

  // assert
  await expect(composer).toHaveValue('')
}
