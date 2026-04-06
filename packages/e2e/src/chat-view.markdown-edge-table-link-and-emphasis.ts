import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.table-link-and-emphasis'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({
    text: '| Name | Link |\n|---|---|\n| docs | [Open](https://example.com) |\n| style | *italic* |',
  })
  await Chat.handleInput('table link and emphasis')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const table = Locator('.ChatMessages .Message .MarkdownTable')
  const links = Locator('.ChatMessages .Message a')
  const em = Locator('.ChatMessages .Message em')
  await expect(table).toHaveCount(1)
  await expect(links).toHaveCount(1)
  await expect(em).toHaveCount(1)
}
