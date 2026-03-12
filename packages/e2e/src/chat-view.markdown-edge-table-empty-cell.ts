import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.table-empty-cell'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: "| A | B | C |\n|---|---|---|\n| 1 |  | 3 |" })
  await Chat.handleInput("table with empty cell")

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const table = Locator('.ChatMessages .Message .MarkdownTable')
  const dataCells = Locator('.ChatMessages .Message td')
  await expect(table).toHaveCount(1)
  await expect(dataCells).toHaveCount(3)
}
