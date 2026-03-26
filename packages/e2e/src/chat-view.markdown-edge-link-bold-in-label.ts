import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.link-bold-in-label'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '[**BoldLabel**](https://example.com)' })
  await Chat.handleInput('bold inside link label')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const links = Locator('.ChatMessages .Message a')
  const strong = Locator('.ChatMessages .Message strong')
  await expect(links).toHaveCount(1)
  await expect(strong).toHaveCount(0)
}
