import type { Test } from '@lvce-editor/test-with-playwright'

// cspell:ignore Clawpack

export const name = 'chat-view.markdown-edge.loose-ordered-list-sections'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', {
    text: [
      '1. Numerical Methods:',
      'OpenClaw uses finite volume methods for solving systems of hyperbolic PDEs.',
      '',
      '1. Supported Equations:',
      'It supports a wide range of hyperbolic systems:',
      ' - Shallow water equations',
      ' - Compressible Euler equations',
      '',
      '1. Community & Documentation:',
      'OpenClaw is part of the Clawpack project.',
      '',
      'Summary',
      'OpenClaw helps researchers accurately model wave propagation.',
    ].join('\n'),
  })
  await Chat.handleInput('tell me more about OpenClaw')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const assistantMessage = messages.nth(1)
  const topLevelOrdered = assistantMessage.locator('.ChatMessageContent > ol')
  const topLevelOrderedItems = assistantMessage.locator('.ChatMessageContent > ol > li')
  const nestedUnordered = assistantMessage.locator('.ChatMessageContent > ol > li > ul')
  const topLevelParagraphs = assistantMessage.locator('.ChatMessageContent > p')
  await expect(topLevelOrdered).toHaveCount(1)
  await expect(topLevelOrderedItems).toHaveCount(3)
  await expect(nestedUnordered).toHaveCount(1)
  await expect(topLevelParagraphs).toHaveCount(1)
  await expect(topLevelParagraphs).toHaveText('Summary\nOpenClaw helps researchers accurately model wave propagation.')
}
