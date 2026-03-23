import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.cut-input'

export const test: Test = async ({ Chat, ClipBoard, Command, expect, Locator }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.handleInput('cut text')

  // act
  await Command.execute('Chat.cutInput')

  // assert
  await expect(composer).toHaveValue('')
  await ClipBoard.shouldHaveText('cut text')
}
