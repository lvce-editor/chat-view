import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.table-alignment-separator'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({ text: '| A | B |\n|:---|---:|\n| 1 | 2 |' })
  await Chat.handleInput('table alignment syntax')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const table = Locator('.ChatMessages .Message .MarkdownTable')
  const headers = Locator('.ChatMessages .Message th')
  await expect(table).toHaveCount(1)
  await expect(headers).toHaveCount(2)
}
