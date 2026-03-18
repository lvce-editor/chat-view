import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.syntax-highlighting-json'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '```json\n{"name":"chat-view","enabled":true,"count":42,"value":null}\n```' })
  await Chat.handleInput('show json code block')
  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  const codeBlocks = Locator('.ChatMessages .Message pre code')
  const jsonProperties = Locator('.ChatMessages .Message pre code .TokenProperty')
  const jsonStrings = Locator('.ChatMessages .Message pre code .TokenString')
  const jsonKeywords = Locator('.ChatMessages .Message pre code .TokenKeyword')
  const jsonNumbers = Locator('.ChatMessages .Message pre code .TokenNumber')
  await expect(messages).toHaveCount(2)
  await expect(codeBlocks).toHaveCount(1)
  await expect(jsonProperties).toHaveCount(4)
  await expect(jsonProperties.nth(0)).toHaveText('"name"')
  await expect(jsonProperties.nth(3)).toHaveText('"value"')
  await expect(jsonStrings).toHaveCount(1)
  await expect(jsonStrings).toHaveText('"chat-view"')
  await expect(jsonKeywords).toHaveCount(2)
  await expect(jsonKeywords.nth(0)).toHaveText('true')
  await expect(jsonKeywords.nth(1)).toHaveText('null')
  await expect(jsonNumbers).toHaveCount(1)
  await expect(jsonNumbers).toHaveText('42')
}
