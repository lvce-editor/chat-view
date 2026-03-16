import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.inline-code'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: 'Here is some inline code: `let x = 10; // This is a comment!`' })
  await Chat.handleInput('show inline code formatting')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  const inlineCode = Locator('.ChatMessages .Message code')
  await expect(messages).toHaveCount(2)
  await expect(inlineCode).toHaveCount(1)
  await expect(inlineCode).toHaveText('let x = 10; // This is a comment!')
}
