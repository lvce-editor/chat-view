import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.mixed-multi-blocks-4'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', {
    text: '# Title\n\nParagraph with **bold** and *italic*.\n\n- Item A\n- Item B\n\n```\nplain code\n```',
  })
  await Chat.handleInput('mixed markdown 4')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const h1 = Locator('.ChatMessages .Message h1')
  const strong = Locator('.ChatMessages .Message strong')
  const em = Locator('.ChatMessages .Message em')
  const unordered = Locator('.ChatMessages .Message ul')
  const code = Locator('.ChatMessages .Message pre code')
  await expect(h1).toHaveCount(1)
  await expect(strong).toHaveCount(1)
  await expect(em).toHaveCount(1)
  await expect(unordered).toHaveCount(1)
  await expect(code).toHaveCount(1)
}
