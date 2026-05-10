import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-input-multiple-characters'

<<<<<<< HEAD
=======
export const skip = 1

>>>>>>> origin/main
export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  // act
  await Chat.handleInput('a')
<<<<<<< HEAD
  await Chat.handleInput('ab')
  await Chat.handleInput('abc')
  await Chat.handleInput('abcd')
=======
  await Chat.handleInput('b')
  await Chat.handleInput('c')
  await Chat.handleInput('d')
>>>>>>> origin/main

  // assert
  await expect(composer).toHaveValue('abcd')
}
