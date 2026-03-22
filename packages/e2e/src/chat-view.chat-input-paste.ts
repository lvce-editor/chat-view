import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-input-paste'

export const skip = 1

export const test: Test = async ({ Chat, ClipBoard, Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  await ClipBoard.writeText('abc')
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  // act
  await Command.execute('Chat.handleInputPaste')

  // assert
  await expect(composer).toHaveValue('abc')
}
