import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.syntax-highlighting-js'

export const skip = 1
export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({ text: '```js\nconst answer = 42 // value\n```' })
  await Chat.handleInput('show js code block')
  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const codeBlocks = Locator('.ChatMessages .Message pre code')
  const jsKeywords = Locator('.ChatMessages .Message pre code .TokenKeyword')
  const jsNumbers = Locator('.ChatMessages .Message pre code .TokenNumber')
  const jsComments = Locator('.ChatMessages .Message pre code .TokenComment')
  await expect(messages).toHaveCount(2)
  await expect(codeBlocks).toHaveCount(1)
  await expect(jsKeywords).toHaveCount(1)
  await expect(jsKeywords).toHaveText('const')
  await expect(jsNumbers).toHaveCount(1)
  await expect(jsNumbers).toHaveText('42')
  await expect(jsComments).toHaveCount(1)
  await expect(jsComments).toHaveText('// value')
}
