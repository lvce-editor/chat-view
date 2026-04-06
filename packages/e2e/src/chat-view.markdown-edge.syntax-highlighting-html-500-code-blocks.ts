import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.syntax-highlighting-html-500-code-blocks'

export const skip = 1
export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')

  const blockCount = 500
  const htmlBlocks = Array.from({ length: blockCount }, (_, i) => {
    const number = i + 1
    return `\`\`\`html\n<div class="hero-${number}">Hello ${number}</div>\n\`\`\``
  }).join('\n\n')

  await Chat.registerMockResponse({ text: htmlBlocks })
  await Chat.handleInput('show me 500 different html code blocks')
  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const codeBlocks = Locator('.ChatMessages .Message pre code')
  const htmlTags = Locator('.ChatMessages .Message pre code .TokenTag')
  const htmlAttributes = Locator('.ChatMessages .Message pre code .TokenAttribute')
  const htmlStrings = Locator('.ChatMessages .Message pre code .TokenString')
  await expect(messages).toHaveCount(2)
  await expect(codeBlocks).toHaveCount(blockCount)
  await expect(htmlTags).toHaveCount(blockCount * 3)
  await expect(htmlAttributes).toHaveCount(blockCount)
  await expect(htmlStrings).toHaveCount(blockCount)
  await expect(htmlTags.nth(0)).toHaveText('<div')
  await expect(htmlTags.nth(blockCount * 3 - 1)).toHaveText('</div>')
  await expect(htmlAttributes.nth(0)).toHaveText('class')
  await expect(htmlAttributes.nth(blockCount - 1)).toHaveText('class')
  await expect(htmlStrings.nth(0)).toHaveText('"hero-1"')
  await expect(htmlStrings.nth(blockCount - 1)).toHaveText(`"hero-${blockCount}"`)
}
