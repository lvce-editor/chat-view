import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.plan-mode-implement-click-executes-plan'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.handleAgentModeChange', 'plan')
  await Chat.mockOpenApiStreamReset()
  await Chat.mockOpenApiStreamPushChunk('1. Inspect the relevant files\n2. Implement the change\n3. Run verification')
  await Chat.mockOpenApiStreamFinish()
  await Chat.handleInput('make a plan for the settings view')
  await Chat.handleSubmit()

  await Chat.mockOpenApiStreamReset()
  await Chat.mockOpenApiStreamPushChunk('Implemented the requested plan.')
  await Chat.mockOpenApiStreamFinish()

  const implementButton = Locator('.ChatSendAreaBottom .Button[name="implement-plan"]')
  const agentModeSelect = Locator('.ChatSendArea .ChatSelect[name="agent-mode-picker-toggle"]')
  await Command.execute('Chat.handleClick', 'implement-plan')

  const messages = Locator('.ChatMessages .Message')

  await expect(agentModeSelect).toHaveText('Agent')
  await expect(messages).toHaveCount(4)
  const message2 = messages.nth(2)
  await expect(message2).toContainText('Execute this implementation plan in the current workspace.')
  const message3 = messages.nth(3)
  await expect(message3).toContainText('Implemented the requested plan.')
  await expect(implementButton).toHaveCount(0)
}
