import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.inline-multi-line-emphasis'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '*line one\nline two*' })
  await Chat.handleInput('multiline emphasis')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const em = Locator('.ChatMessages .Message em')
  await expect(em).toHaveCount(1)
}
