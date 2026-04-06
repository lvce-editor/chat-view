import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.list-unordered-inside-ordered-2'

export const skip = 1

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({ text: '1. Breakfast\n   - Eggs\n   - Toast\n2. Dinner' })
  await Chat.handleInput('show mixed nested list 2')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const ordered = Locator('.ChatMessages .Message ol')
  const unordered = Locator('.ChatMessages .Message ul')
  await expect(ordered).toHaveCount(1)
  await expect(unordered).toHaveCount(1)
}
