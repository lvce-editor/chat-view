import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.clear-input'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Command.execute('Chat.handleInput', 'composer', 'hello from script input', 'script')
  await expect(composer).toHaveValue('hello from script input')

  // act
  await Command.execute('Chat.clearInput')

  // assert
  await expect(composer).toHaveValue('')
}
