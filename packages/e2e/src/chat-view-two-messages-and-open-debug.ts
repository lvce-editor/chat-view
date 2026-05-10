import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const name = 'chat-view.two-messages-and-open-debug'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.handleInput('hello from e2e')
  await Chat.handleSubmit()
  await Chat.handleInput('hello from e2e')
  await Chat.handleSubmit()
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(4)
  const firstMessage = messages.nth(0)
  await expect(firstMessage).toHaveText('hello from e2e')
  const secondMessage = messages.nth(1)
  await expect(secondMessage).toHaveText('Mock AI response: I received "hello from e2e".')

  // act
  await Command.execute(`Chat.openDebugView`)

  // assert
  const rows = Locator('.TableBody .TableRow')
  await expect(rows).toHaveCount(4)
}
