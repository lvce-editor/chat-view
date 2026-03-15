import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-offline-request-failed-mock'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiSetRequestFailedResponse', true)
  await Chat.handleInput('hello from e2e')

  // act
  await Chat.handleSubmit()

  // assert
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toHaveText('OpenAI request failed because you are offline. Please check your internet connection.')
}
