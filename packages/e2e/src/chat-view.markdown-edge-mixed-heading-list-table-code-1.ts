import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.mixed-heading-list-table-code-1'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', {
    text: "## Plan\n\n1. Build\n2. Test\n\n| Step | Status |\n|---|---|\n| Build | done |\n\n```ts\nconsole.log('ok')\n```",
  })
  await Chat.handleInput('mixed markdown 1')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const headings = Locator('.ChatMessages .Message h2')
  const ordered = Locator('.ChatMessages .Message ol')
  const tables = Locator('.ChatMessages .Message .MarkdownTable')
  const code = Locator('.ChatMessages .Message pre code')
  await expect(headings).toHaveCount(1)
  await expect(ordered).toHaveCount(1)
  await expect(tables).toHaveCount(1)
  await expect(code).toHaveCount(1)
}
