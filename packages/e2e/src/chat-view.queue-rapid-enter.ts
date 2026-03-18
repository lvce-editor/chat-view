import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.queue-rapid-enter'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.useMockApi()

  for (let i = 0; i < 10; i++) {
    await Chat.handleInput(`message-${i}`)
    await Chat.handleSubmit()
  }

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(20)
  // TODO verify ordering and duplicate prevention under rapid submits.
}
