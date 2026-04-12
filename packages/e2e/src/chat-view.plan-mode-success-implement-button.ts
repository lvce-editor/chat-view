import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.plan-mode-success-implement-button'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.handleAgentModeChange', 'plan')
  await Chat.mockOpenApiStreamReset()
  await Chat.mockOpenApiStreamPushChunk('1. Inspect files\n2. Update the code\n3. Verify the result')
  await Chat.mockOpenApiStreamFinish()
  await Chat.handleInput('make a plan for the branch picker')
  await Chat.handleSubmit()

  const agentModeSelect = Locator('.ChatSendArea .ChatSelect[name="agent-mode-picker-toggle"]')
  const messages = Locator('.ChatMessages .Message')
  const implementButton = Locator('.ChatSendAreaBottom .Button[name="implement-plan"]')

  await expect(agentModeSelect).toHaveText('Plan')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('1. Inspect files')
  await expect(messages.nth(1)).toContainText('3. Verify the result')
  await expect(implementButton).toBeVisible()
}
