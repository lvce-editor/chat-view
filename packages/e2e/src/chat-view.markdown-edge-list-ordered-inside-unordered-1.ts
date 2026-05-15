import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.list-ordered-inside-unordered-1'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '- Fruits\n  1. Apple\n  2. Banana' })
  await Chat.handleInput('show nested list')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const nested = Locator('.ChatMessages .Message ol')
  await expect(nested).toHaveCount(1)
}
