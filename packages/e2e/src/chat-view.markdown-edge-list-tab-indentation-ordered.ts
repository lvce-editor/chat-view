import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.list-tab-indentation-ordered'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: '1. Root\n\t1. Child\n\t\t1. Grandchild' })
  await Chat.handleInput('tab indented nested ordered list')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const depth3 = Locator('.ChatMessages .Message ol ol ol')
  await expect(depth3).toHaveCount(1)
}
