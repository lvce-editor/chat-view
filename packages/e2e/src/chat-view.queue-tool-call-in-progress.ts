import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.queue-tool-call-in-progress'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')

  await Chat.handleInput('read index.html')
  await Chat.handleSubmit()
  await Chat.handleInput('queued follow up')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(3)
  // TODO validate queue behavior while a tool-call chain is still active.
}
