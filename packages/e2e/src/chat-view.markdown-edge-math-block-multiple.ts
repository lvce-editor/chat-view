// cspell:ignore katex
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.math-block-multiple'

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
    text: '$$\na^2+b^2=c^2\n$$\n\n$$\n\\int_0^1 x dx = \\frac{1}{2}\n$$',
  })
  await Chat.handleInput('multiple block math')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const blockMath = Locator('.ChatMessages .Message .MarkdownMathBlock')
  const blockKatex = Locator('.ChatMessages .Message .MarkdownMathBlock .katex-display')
  await expect(messages).toHaveCount(2)
  await expect(blockMath).toHaveCount(2)
  await expect(blockKatex).toHaveCount(2)
}
