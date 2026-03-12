import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.mixed-link-list-emphasis-3'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '- Read [guide](https://example.com/guide)\n- Mark as **done**\n- Keep *notes*' })
  await Chat.handleInput('mixed markdown 3')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const unordered = Locator('.ChatMessages .Message ul')
  const links = Locator('.ChatMessages .Message a')
  const strong = Locator('.ChatMessages .Message strong')
  const em = Locator('.ChatMessages .Message em')
  await expect(unordered).toHaveCount(1)
  await expect(links).toHaveCount(1)
  await expect(strong).toHaveCount(1)
  await expect(em).toHaveCount(1)
}
