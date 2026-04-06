import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.partial-unclosed-code-fence'

export const skip = 1
export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({ text: 'Here is code:\n\n```ts\nconst value = 1' })
  await Chat.handleInput('unclosed code fence')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const codeBlocks = Locator('.ChatMessages .Message pre code')
  await expect(codeBlocks).toHaveCount(1)
  await expect(codeBlocks).toContainText('const value = 1')
}
