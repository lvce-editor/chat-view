import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.paste-input'

export const test: Test = async ({ Chat, ClipBoard, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  await ClipBoard.enableMemoryClipBoard()
  await ClipBoard.writeText('abc')
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  // act
  await Command.execute('Chat.pasteInput')

  // assert
  await expect(composer).toHaveValue('abc')
}
