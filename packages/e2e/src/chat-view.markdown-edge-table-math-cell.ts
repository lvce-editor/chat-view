// cspell:ignore katex
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.table-math-cell'

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
    text: '| Formula |\n|---|\n| $x^2 + y^2$ |',
  })
  await Chat.handleInput('table math cell')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  const table = Locator('.ChatMessages .Message .MarkdownTable')
  const inlineKatex = Locator('.ChatMessages .Message .MarkdownTable .MarkdownMathInline .katex')
  await expect(messages).toHaveCount(2)
  await expect(table).toHaveCount(1)
  await expect(inlineKatex).toHaveCount(1)
}
