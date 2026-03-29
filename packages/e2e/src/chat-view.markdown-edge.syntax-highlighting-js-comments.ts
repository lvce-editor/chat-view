import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.syntax-highlighting-js-comments'

export const skip = 1
export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '```javascript\n/* heading */\nconst answer = 42 // value\n```' })
  await Chat.handleInput('show javascript comments')
  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const codeBlocks = Locator('.ChatMessages .Message pre code')
  const jsComments = Locator('.ChatMessages .Message pre code .TokenComment')
  await expect(messages).toHaveCount(2)
  await expect(codeBlocks).toHaveCount(1)
  await expect(jsComments).toHaveCount(2)
  await expect(jsComments.nth(0)).toHaveText('/* heading */')
  await expect(jsComments.nth(1)).toHaveText('// value')
}
