import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.math-code-fence'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '```ts\nconst formula = "$x^2$"\n```' })
  await Chat.handleInput('math in code fence')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  const codeBlocks = Locator('.ChatMessages .Message pre code')
  const inlineMath = Locator('.ChatMessages .Message .MarkdownMathInline')
  const blockMath = Locator('.ChatMessages .Message .MarkdownMathBlock')
  await expect(messages).toHaveCount(2)
  await expect(codeBlocks).toHaveCount(1)
  await expect(codeBlocks).toContainText('const formula = "$x^2$"')
  await expect(inlineMath).toHaveCount(0)
  await expect(blockMath).toHaveCount(0)
}
