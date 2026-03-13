// cspell:ignore Katex katex
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.math-block-invalid-latex'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '$$\n\\notARealCommand{x}\n$$' })
  await Chat.handleInput('invalid block latex')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  const blockMath = Locator('.ChatMessages .Message .MarkdownMathBlock')
  const blockKatex = Locator('.ChatMessages .Message .MarkdownMathBlock .katex-display')
  const assistant = Locator('.ChatMessages .Message').nth(1)
  await expect(messages).toHaveCount(2)
  await expect(blockMath).toHaveCount(1)
  await expect(blockKatex).toHaveCount(0)
  await expect(assistant).toContainText('$$')
  await expect(assistant).toContainText('\\notARealCommand{x}')
}
