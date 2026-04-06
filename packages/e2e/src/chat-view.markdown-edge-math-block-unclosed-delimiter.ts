import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.math-block-unclosed-delimiter'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({ text: 'Before\n\n$$\nx = y + z\n\nAfter' })
  await Chat.handleInput('unclosed block math delimiter')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const blockMath = Locator('.ChatMessages .Message .MarkdownMathBlock')
  const assistant = Locator('.ChatMessages .Message').nth(1)
  await expect(messages).toHaveCount(2)
  await expect(blockMath).toHaveCount(0)
  await expect(assistant).toContainText('$$')
  await expect(assistant).toContainText('x = y + z')
}
