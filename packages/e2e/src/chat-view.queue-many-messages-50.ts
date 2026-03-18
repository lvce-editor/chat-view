import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.queue-many-messages-50'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()

  for (let i = 0; i < 50; i++) {
    await Chat.handleInput(`queued-${i}`)
    await Chat.handleSubmit()
  }

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(100)
  // TODO verify queue throughput, ordering guarantees, and UI responsiveness for large queues.
}
