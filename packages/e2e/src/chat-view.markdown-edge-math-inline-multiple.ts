// cspell:ignore katex
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.math-inline-multiple'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: 'Use $a^2+b^2=c^2$ and $e^{i\\pi}+1=0$.' })
  await Chat.handleInput('multiple inline math')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const inlineMath = Locator('.ChatMessages .Message .MarkdownMathInline')
  const katex = Locator('.ChatMessages .Message .MarkdownMathInline .katex')
  await expect(messages).toHaveCount(2)
  await expect(inlineMath).toHaveCount(2)
  await expect(katex).toHaveCount(2)
}
