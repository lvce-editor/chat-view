import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.partial-unclosed-italic'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: "Start *italic text that never closes" })
  await Chat.handleInput("unclosed italic")

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const em = Locator('.ChatMessages .Message em')
  await expect(em).toHaveCount(0)
  const assistant = Locator('.ChatMessages .Message').nth(1)
  await expect(assistant).toContainText('*italic text that never closes')
}
