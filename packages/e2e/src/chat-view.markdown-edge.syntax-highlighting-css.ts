import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.syntax-highlighting-css'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '```css\n.card { color: #fff; }\n```' })
  await Chat.handleInput('show css code block')
  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const codeBlocks = Locator('.ChatMessages .Message pre code')
  const cssProperties = Locator('.ChatMessages .Message pre code .TokenProperty')
  const cssValues = Locator('.ChatMessages .Message pre code .TokenValue')
  await expect(messages).toHaveCount(2)
  await expect(codeBlocks).toHaveCount(1)
  await expect(cssProperties).toHaveCount(1)
  await expect(cssProperties).toHaveText('color')
  await expect(cssValues).toHaveCount(1)
  await expect(cssValues).toHaveText('#fff')
}
