import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.syntax-highlighting-ts'

export const skip = 1
export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({
    text: '```ts\ninterface User {\n  readonly name: string\n}\n\nconst user = "chat-view" as const\n```',
  })
  await Chat.handleInput('show ts code block')
  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const codeBlocks = Locator('.ChatMessages .Message pre code')
  const tsKeywords = Locator('.ChatMessages .Message pre code .TokenKeyword')
  const tsStrings = Locator('.ChatMessages .Message pre code .TokenString')
  await expect(messages).toHaveCount(2)
  await expect(codeBlocks).toHaveCount(1)
  await expect(tsKeywords).toHaveCount(6)
  await expect(tsKeywords.nth(0)).toHaveText('interface')
  await expect(tsKeywords.nth(1)).toHaveText('readonly')
  await expect(tsKeywords.nth(2)).toHaveText('string')
  await expect(tsKeywords.nth(3)).toHaveText('const')
  await expect(tsKeywords.nth(4)).toHaveText('as')
  await expect(tsKeywords.nth(5)).toHaveText('const')
  await expect(tsStrings).toHaveCount(1)
  await expect(tsStrings).toHaveText('"chat-view"')
}
