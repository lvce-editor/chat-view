import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.invalid-unordered-no-space'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '-Item without required space' })
  await Chat.handleInput('invalid unordered list no space')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const unordered = Locator('.ChatMessages .Message ul')
  await expect(unordered).toHaveCount(0)
  const assistant = Locator('.ChatMessages .Message').nth(1)
  await expect(assistant).toContainText('-Item without required space')
}
