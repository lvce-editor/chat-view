import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.invalid-ordered-no-space'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({ text: '1.Item without required space' })
  await Chat.handleInput('invalid ordered list no space')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const ordered = Locator('.ChatMessages .Message ol')
  await expect(ordered).toHaveCount(0)
  const assistant = Locator('.ChatMessages .Message').nth(1)
  await expect(assistant).toContainText('1.Item without required space')
}
