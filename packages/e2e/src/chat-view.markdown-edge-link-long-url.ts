import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.link-long-url'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const longPath = `segment-${'a'.repeat(2048)}`
  const longUrl = `https://example.com/${longPath}?q=${'b'.repeat(512)}`
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: `[Long URL](${longUrl})` })
  await Chat.handleInput('test very long markdown url')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const links = Locator('.ChatMessages .Message a')
  await expect(links).toHaveCount(1)
  await expect(links).toHaveAttribute('href', longUrl)
}
