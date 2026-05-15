import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.paste-input'

export const skip = 1

export const test: Test = async ({ Chat, ClipBoard, expect, Locator }) => {
  // arrange
  await Chat.show()
  await ClipBoard.enableMemoryClipBoard()
  await ClipBoard.writeText('abc')
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  // act
  await Chat.handleInputPaste()

  // assert
  await expect(composer).toHaveValue('abc')
}
