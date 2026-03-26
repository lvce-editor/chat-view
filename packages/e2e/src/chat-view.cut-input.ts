import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.cut-input'

export const skip = 1

export const test: Test = async ({ Chat, ClipBoard, expect, Locator }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.handleInput('cut text')

  // act
  await Chat.handleInputCut()

  // assert
  await expect(composer).toHaveValue('')
  await ClipBoard.shouldHaveText('cut text')
}
