import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.two-messages-and-open-debug-preview'

export const test: Test = async ({ Chat, ChatDebug, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.handleInput('hello from e2e')
  await Chat.handleSubmit()
  await Chat.handleInput('second message')
  await Chat.handleSubmit()
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(4)
  const firstMessage = messages.nth(0)
  await expect(firstMessage).toHaveText('hello from e2e')
  await Chat.openDebugView()
  await ChatDebug.selectEventRow(1)

  // act
  await ChatDebug.openTabPreview()

  // assert
  const preview = Locator('.PreviewVirtualizedEditor .EditorRows')
  await expect(preview).toBeVisible()
  await expect(preview).toHaveText('Mock AI response: I received "second message".')
}
