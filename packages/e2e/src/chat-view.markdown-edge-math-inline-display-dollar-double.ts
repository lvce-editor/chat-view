// cspell:ignore katex
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.math-inline-display-dollar-double'

export const skip = 1
export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({ text: 'Display inline with double delimiters: $$\\int_0^1 x^2 dx = \\frac{1}{3}$$.' })
  await Chat.handleInput('double dollar inline math')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const inlineMath = Locator('.ChatMessages .Message .MarkdownMathInline')
  const katexDisplay = Locator('.ChatMessages .Message .MarkdownMathInline .katex-display')
  await expect(messages).toHaveCount(2)
  await expect(inlineMath).toHaveCount(1)
  await expect(katexDisplay).toHaveCount(1)
}
