import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.syntax-highlighting-html'

export const skip = 1
export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({ text: '```html\n<div class="hero">Hello</div>\n```' })
  await Chat.handleInput('show html code block')
  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const codeBlocks = Locator('.ChatMessages .Message pre code')
  const htmlTags = Locator('.ChatMessages .Message pre code .TokenTag')
  const htmlAttributes = Locator('.ChatMessages .Message pre code .TokenAttribute')
  const htmlStrings = Locator('.ChatMessages .Message pre code .TokenString')
  await expect(messages).toHaveCount(2)
  await expect(codeBlocks).toHaveCount(1)
  await expect(htmlTags).toHaveCount(3)
  await expect(htmlTags.nth(0)).toHaveText('<div')
  await expect(htmlTags.nth(2)).toHaveText('</div>')
  await expect(htmlAttributes).toHaveCount(1)
  await expect(htmlAttributes).toHaveText('class')
  await expect(htmlStrings).toHaveCount(1)
  await expect(htmlStrings).toHaveText('"hero"')
}
