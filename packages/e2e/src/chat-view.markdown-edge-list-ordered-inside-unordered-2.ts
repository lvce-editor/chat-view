import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.list-ordered-inside-unordered-2'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '- Languages\n  1. TypeScript\n  2. Rust\n- Databases' })
  await Chat.handleInput('show nested list 2')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const ordered = Locator('.ChatMessages .Message ol')
  const unordered = Locator('.ChatMessages .Message ul')
  await expect(unordered).toHaveCount(1)
  await expect(ordered).toHaveCount(1)
}
