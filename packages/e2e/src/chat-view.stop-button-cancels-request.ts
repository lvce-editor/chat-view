import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.stop-button-cancels-request'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiStreamReset')
  await Chat.handleInput('hello from e2e')

  const submitPromise = Chat.handleSubmit()

  const stopButton = Locator('.IconButton[name="stop"]')
  await expect(stopButton).toBeVisible()
  await expect(stopButton).toHaveAttribute('title', 'Stop generation')

  await stopButton.click()
  await submitPromise

  const sendButton = Locator('.IconButton[name="send"]')
  await expect(sendButton).toBeVisible()
  await expect(sendButton).toHaveAttribute('title', 'Send message')
}
