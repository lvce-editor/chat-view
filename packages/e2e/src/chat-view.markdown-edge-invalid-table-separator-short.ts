import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.invalid-table-separator-short'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '| A | B |\n|--|---|\n| 1 | 2 |' })
  await Chat.handleInput('invalid table separator')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const tables = Locator('.ChatMessages .Message .MarkdownTable')
  await expect(tables).toHaveCount(0)
}
