// cspell:ignore Katex katex

import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.math-inline'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: 'Quadratic roots are $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.' })
  await Chat.handleInput('inline math')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  const inlineMath = Locator('.ChatMessages .Message .MarkdownMathInline')
  const inlineKatex = Locator('.ChatMessages .Message .MarkdownMathInline .katex')
  await expect(messages).toHaveCount(2)
  await expect(inlineMath).toHaveCount(1)
  await expect(inlineKatex).toHaveCount(1)
}
