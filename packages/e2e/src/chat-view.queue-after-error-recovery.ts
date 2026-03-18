import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.queue-after-error-recovery'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')

  await Chat.handleInput('first')
  await Chat.handleSubmit()
  await Chat.handleInput('second')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(4)
  // TODO validate behavior after user fixes API key following a blocked queue.
}
