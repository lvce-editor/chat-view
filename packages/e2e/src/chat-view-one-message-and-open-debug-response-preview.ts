import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.one-messages-and-open-debug-response-preview'

export const test: Test = async ({ ChatDebug, Chat, expect, Locator, Command, FileSystem, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.handleInput('hello from e2e')
  await Chat.handleSubmit()
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const firstMessage = messages.nth(0)
  await expect(firstMessage).toHaveText('hello from e2e')
  const secondMessage = messages.nth(1)
  await expect(secondMessage).toHaveText('Mock AI response: I received "hello from e2e".')
  await Command.execute(`Chat.openDebugView`)
  const rows = Locator('.TableBody .TableRow')
  await expect(rows).toHaveCount(1)
  await ChatDebug.selectEventRow(0)

  // act
  await ChatDebug.openTabPreview()

  // assert
  const preview = Locator('.ChatDebugViewDetailsBottom .EditorRows')
  await expect(preview).toBeVisible()
  await expect(preview).toHaveText('Mock AI response: I received "hello from e2e".')
}
