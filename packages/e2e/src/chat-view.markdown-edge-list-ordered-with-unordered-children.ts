import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.list-ordered-with-unordered-children'

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
      '1. Ancient and Medieval Periods:',
      ' - Inhabited since prehistoric times.',
      ' - Settled by the Ligurians.',
      '2. The Grimaldi Family:',
      ' - Captured the fortress in 1297.',
    ].join('\n'),
  })
  await Chat.handleInput('monaco history list')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const topLevelOrdered = Locator('.ChatMessages .Message > ol')
  const nestedUnordered = Locator('.ChatMessages .Message > ol > li > ul')
  await expect(topLevelOrdered).toHaveCount(1)
  await expect(nestedUnordered).toHaveCount(2)
}
