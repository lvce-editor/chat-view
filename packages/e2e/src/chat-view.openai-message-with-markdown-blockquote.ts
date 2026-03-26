import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-message-with-markdown-blockquote'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const mockText = ['> This is a quote.', '> ', '> - It can contain lists.', '> - **Bold text**', '> - `Inline code`'].join('\n')
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: mockText })
  await Chat.handleInput('show quote formatting')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const quote = Locator('.ChatMessages .Message .MarkdownQuote')
  const list = Locator('.ChatMessages .Message .MarkdownQuote ul')
  const bold = Locator('.ChatMessages .Message .MarkdownQuote strong')
  const listItems = Locator('.ChatMessages .Message .MarkdownQuote li')
  await expect(messages).toHaveCount(2)
  await expect(quote).toHaveCount(1)
  await expect(list).toHaveCount(1)
  await expect(listItems).toHaveCount(3)
  await expect(bold).toHaveCount(1)
}
