import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.inline-bold-and-link'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: 'Use **important** [docs](https://example.com/docs) now' })
  await Chat.handleInput('bold and link mix')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const strong = Locator('.ChatMessages .Message strong')
  const links = Locator('.ChatMessages .Message a')
  await expect(strong).toHaveCount(1)
  await expect(links).toHaveCount(1)
}
