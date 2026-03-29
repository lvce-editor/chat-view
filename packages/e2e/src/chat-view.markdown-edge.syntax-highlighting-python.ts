import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.syntax-highlighting-python'

export const skip = 1
export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '```python\ndef area(radius):\n    return 3.14 # pi\n```' })
  await Chat.handleInput('show python code block')
  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const codeBlocks = Locator('.ChatMessages .Message pre code')
  const pyKeywords = Locator('.ChatMessages .Message pre code .TokenKeyword')
  const pyNumbers = Locator('.ChatMessages .Message pre code .TokenNumber')
  const pyComments = Locator('.ChatMessages .Message pre code .TokenComment')
  await expect(messages).toHaveCount(2)
  await expect(codeBlocks).toHaveCount(1)
  await expect(pyKeywords).toHaveCount(2)
  await expect(pyKeywords.nth(0)).toHaveText('def')
  await expect(pyKeywords.nth(1)).toHaveText('return')
  await expect(pyNumbers).toHaveCount(1)
  await expect(pyNumbers).toHaveText('3.14')
  await expect(pyComments).toHaveCount(1)
  await expect(pyComments).toHaveText('# pi')
}
