import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.table-heading-cell'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({
    text: '| Section |\n|---|\n| ### Nested heading |',
  })
  await Chat.handleInput('table heading cell')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const table = Locator('.ChatMessages .Message .MarkdownTable')
  const headings = Locator(
    '.ChatMessages .Message .MarkdownTable h1, .ChatMessages .Message .MarkdownTable h2, .ChatMessages .Message .MarkdownTable h3',
  )
  await expect(messages).toHaveCount(2)
  await expect(table).toHaveCount(1)
  await expect(headings).toHaveCount(0)
}
