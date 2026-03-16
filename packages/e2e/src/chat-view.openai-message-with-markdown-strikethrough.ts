import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-message-with-markdown-strikethrough'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const mockText = 'Here is ~~strikethrough~~.'
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: mockText })
  await Chat.handleInput('show strikethrough formatting')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  const strikethrough = Locator('.ChatMessages .Message .StrikeThrough')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('show strikethrough formatting')
  await expect(strikethrough).toHaveCount(1)
  await expect(strikethrough).toHaveText('strikethrough')
}
