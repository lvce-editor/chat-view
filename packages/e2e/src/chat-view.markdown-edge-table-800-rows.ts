import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.table-800-rows'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')

  const rowCount = 800
  const rows = Array.from({ length: rowCount }, (_, i) => `| R${i + 1} | ${i + 1} |`).join('\n')
  const text = `| Name | Value |\n|---|---|\n${rows}`

  await Command.execute('Chat.registerMockResponse', { text })
  await Chat.handleInput('table 800 rows')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const table = Locator('.ChatMessages .Message .MarkdownTable')
  const tableRows = Locator('.ChatMessages .Message tbody tr')
  await expect(messages).toHaveCount(2)
  await expect(table).toHaveCount(1)
  await expect(tableRows).toHaveCount(rowCount)
}
