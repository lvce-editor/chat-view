import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.table-800-columns'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')

  const cellCount = 800
  const headers = Array.from({ length: cellCount }, (_, i) => `H${i + 1}`).join(' | ')
  const separators = Array.from({ length: cellCount }).fill('---').join('|')
  const values = Array.from({ length: cellCount }, (_, i) => `V${i + 1}`).join(' | ')
  const text = `| ${headers} |\n|${separators}|\n| ${values} |`

  await Command.execute('Chat.registerMockResponse', { text })
  await Chat.handleInput('table 800 columns')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  const table = Locator('.ChatMessages .Message .MarkdownTable')
  const headerCells = Locator('.ChatMessages .Message thead th')
  const bodyCells = Locator('.ChatMessages .Message tbody tr td')
  await expect(messages).toHaveCount(2)
  await expect(table).toHaveCount(1)
  await expect(headerCells).toHaveCount(cellCount)
  await expect(bodyCells).toHaveCount(cellCount)
}
