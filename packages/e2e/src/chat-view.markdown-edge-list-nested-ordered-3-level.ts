import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.list-nested-ordered-3-level'

export const skip = 0

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '1. L1\n   1. L2\n      1. L3' })
  await Chat.handleInput('3 level ordered list')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const depth3 = Locator('.ChatMessages .Message ol ol ol')
  await expect(depth3).toHaveCount(1)
}
