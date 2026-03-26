import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-message-with-markdown-bold-italic'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const mockText = 'Here is **test** in bold and *test* in italic.'
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: mockText })
  await Chat.handleInput('show test formatting')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const bold = Locator('.ChatMessages .Message strong')
  const italic = Locator('.ChatMessages .Message em')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('show test formatting')
  await expect(bold).toHaveCount(1)
  await expect(italic).toHaveCount(1)
  await expect(bold).toHaveText('test')
  await expect(italic).toHaveText('test')
}
