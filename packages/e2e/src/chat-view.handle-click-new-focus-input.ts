import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-click-new-focus-input'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()

  // act
  await Chat.handleClickNew()

  // assert
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeFocused()
}
