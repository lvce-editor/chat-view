// cspell:ignore katex infty
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.math-mixed-inline-and-block'

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
    text: 'The identity is $a^2-b^2=(a-b)(a+b)$ and also:\n\n$$\n\\sum_{n=1}^{\\infty} \\frac{1}{n^2}=\\frac{\\pi^2}{6}\n$$',
  })
  await Chat.handleInput('mixed inline and block math')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const inlineMath = Locator('.ChatMessages .Message .MarkdownMathInline')
  const blockMath = Locator('.ChatMessages .Message .MarkdownMathBlock')
  const inlineKatex = Locator('.ChatMessages .Message .MarkdownMathInline .katex')
  const blockKatex = Locator('.ChatMessages .Message .MarkdownMathBlock .katex-display')
  await expect(messages).toHaveCount(2)
  await expect(inlineMath).toHaveCount(1)
  await expect(blockMath).toHaveCount(1)
  await expect(inlineKatex).toHaveCount(1)
  await expect(blockKatex).toHaveCount(1)
}
