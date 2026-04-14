import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.plan-mode-restored-session-implement-button'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.handleAgentModeChange', 'plan')
  await Command.execute('Chat.openMockSession', 'restored-plan-session', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'make a plan',
      time: '10:00',
    },
    {
      agentMode: 'plan',
      id: 'message-assistant-1',
      role: 'assistant',
      text: '1. Inspect files\n2. Implement\n3. Verify',
      time: '10:01',
    },
  ])

  const implementButton = Locator('.ChatSendAreaBottom .Button[name="implement-plan"]')
  const messages = Locator('.ChatMessages .Message')

  await expect(messages).toHaveCount(2)
  await expect(implementButton).toBeVisible()
}
