import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.syntax-highlighting-html-500-code-blocks'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
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

  await Command.execute('Chat.registerMockResponse', { text: htmlBlocks })
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
  const htmlTag0 = htmlTags.nth(0)
  await expect(htmlTag0).toHaveText('<div')
  const htmlTagBlockcount31 = htmlTags.nth(blockCount * 3 - 1)
  await expect(htmlTagBlockcount31).toHaveText('</div>')
  const htmlAttribute0 = htmlAttributes.nth(0)
  await expect(htmlAttribute0).toHaveText('class')
  const htmlAttributeBlockcount1 = htmlAttributes.nth(blockCount - 1)
  await expect(htmlAttributeBlockcount1).toHaveText('class')
  const htmlString0 = htmlStrings.nth(0)
  await expect(htmlString0).toHaveText('"hero-1"')
  const htmlStringBlockcount1 = htmlStrings.nth(blockCount - 1)
  await expect(htmlStringBlockcount1).toHaveText(`"hero-${blockCount}"`)
}
