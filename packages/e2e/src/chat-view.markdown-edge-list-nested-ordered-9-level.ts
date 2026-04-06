import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.list-nested-ordered-9-level'

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
    text: '1. L1\n   1. L2\n      1. L3\n         1. L4\n            1. L5\n               1. L6\n                  1. L7\n                     1. L8\n                        1. L9',
  })
  await Chat.handleInput('9 level ordered list')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const depth9 = Locator('.ChatMessages .Message ol ol ol ol ol ol ol ol ol')
  await expect(depth9).toHaveCount(1)
}
