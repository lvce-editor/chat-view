import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-long-chat-message-mock'

export const skip = 1

const longAssistantMessage =
  'Long assistant response start. ' +
  'This is a detailed answer section with multiple sentences and stable text for assertions. '.repeat(300) +
  'Long assistant response end.'

const longResponseEvent = {
  eventId: 601,
  inProgress: false,
  messageId: '9de5f4fa-505f-4e65-a9db-72ce34567cab',
  sessionId: 'cbf58d1f-8f1f-4d43-8a9f-1f56ccab9f2d',
  text: longAssistantMessage,
  time: '10:00 AM',
  timestamp: '2026-03-20T10:00:00.000Z',
  type: 'chat-message-updated',
} as const

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiStreamReset()
  await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(longResponseEvent)}\n\n`)
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  await Chat.mockOpenApiStreamFinish()
  await Chat.handleInput('Please give me a long answer')

  // act
  await Chat.handleSubmit()

  // assert
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('Please give me a long answer')
  await expect(messages.nth(1)).toContainText('Long assistant response start.')
  await expect(messages.nth(1)).toContainText('stable text for assertions.')
  await expect(messages.nth(1)).toContainText('Long assistant response end.')
}
