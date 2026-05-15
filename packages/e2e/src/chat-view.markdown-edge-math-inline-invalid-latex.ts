import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.math-inline-invalid-latex'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: 'Invalid inline: $\\notARealCommand{x}$' })
  await Chat.handleInput('invalid inline latex')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const inlineMath = Locator('.ChatMessages .Message .MarkdownMathInline')
  const assistant = Locator('.ChatMessages .Message').nth(1)
  await expect(messages).toHaveCount(2)
  await expect(inlineMath).toHaveCount(0)
  await expect(assistant).toHaveText(`Invalid inline: $
otARealCommand{x}$`)
}
