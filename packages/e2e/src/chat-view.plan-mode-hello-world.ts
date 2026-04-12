import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.plan-mode-hello-world'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.handleAgentModeChange', 'plan')
  await Chat.mockOpenApiStreamReset()
  await Chat.mockOpenApiStreamPushChunk(
    'Plan mode is for implementation planning, so here is a minimal plan:\n1. Clarify the desired hello-world target\n2. Choose the output location\n3. Implement and verify it',
  )
  await Chat.mockOpenApiStreamFinish()
  await Chat.handleInput('hello world')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  const implementButton = Locator('.ChatSendAreaBottom .Button[name="implement-plan"]')

  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('Plan mode is for implementation planning')
  await expect(messages.nth(1)).toContainText('1. Clarify the desired hello-world target')
  await expect(implementButton).toBeVisible()
}
