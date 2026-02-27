import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-input-script'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  // act
  await Command.execute('Chat.handleInput', 'hello from script input', 'script')

  // assert
  await expect(composer).toHaveValue('hello from script input')
}
