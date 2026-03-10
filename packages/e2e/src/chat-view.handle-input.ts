import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-input'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  // act
  await Chat.handleInput('hello from script input')

  // assert
  await expect(composer).toHaveValue('hello from script input')
}
