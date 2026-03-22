import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.list-mixed-bullets-and-numbers'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '- Alpha\n  1. One\n    - Nested bullet\n      1. Nested number' })
  await Chat.handleInput('mixed list styles')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const ordered = Locator('.ChatMessages .Message ol')
  const unordered = Locator('.ChatMessages .Message ul')
  await expect(ordered).toHaveCount(1)
  await expect(unordered).toHaveCount(2)
}
