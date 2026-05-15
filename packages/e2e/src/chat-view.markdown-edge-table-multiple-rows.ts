import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.table-multiple-rows'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '| A | B |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |\n| 5 | 6 |' })
  await Chat.handleInput('table multiple rows')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const table = Locator('.ChatMessages .Message .MarkdownTable')
  const rows = Locator('.ChatMessages .Message tbody tr')
  await expect(table).toHaveCount(1)
  await expect(rows).toHaveCount(3)
}
