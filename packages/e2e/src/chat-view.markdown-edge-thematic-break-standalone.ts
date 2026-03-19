import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.thematic-break-standalone'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '---' })
  await Chat.handleInput('render standalone thematic break')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const hr = Locator('.ChatMessages .Message hr')
  await expect(hr).toHaveCount(1)
  const assistant = Locator('.ChatMessages .Message').nth(1)
  await expect(assistant).not.toContainText('---')
}
