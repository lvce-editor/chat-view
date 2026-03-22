import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-input-copy'

export const skip = 1

export const test: Test = async ({ Chat, ClipBoard, Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.handleInput('abc')

  // act
  await Command.execute('Chat.handleInputCopy')

  // assert
  await ClipBoard.shouldHaveText('abc')
}
