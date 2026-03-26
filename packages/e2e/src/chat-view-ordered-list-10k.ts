import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.ordered-list-10k'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')

  const itemCount = 10_000
  const text = Array.from({ length: itemCount }, (_, i) => `${i + 1}. Item ${i + 1}`).join('\n')

  await Command.execute('Chat.registerMockResponse', { text })
  await Chat.handleInput('ordered list 10k')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const ordered = Locator('.ChatMessages .Message ol')
  const unordered = Locator('.ChatMessages .Message ul')
  const listItems = Locator('.ChatMessages .Message ol li')
  await expect(messages).toHaveCount(2)
  await expect(ordered).toHaveCount(1)
  await expect(unordered).toHaveCount(0)
  await expect(listItems).toHaveCount(itemCount)
}
