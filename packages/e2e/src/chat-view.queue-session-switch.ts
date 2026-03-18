import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.queue-session-switch'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.useMockApi()

  await Chat.handleInput('first')
  await Chat.handleSubmit()
  await Chat.handleInput('/new')
  await Chat.handleSubmit()
  await Chat.handleInput('queued while switching')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  // TODO define and verify queue ownership semantics across session switches.
}
