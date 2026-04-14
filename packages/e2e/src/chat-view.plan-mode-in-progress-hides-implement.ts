import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.plan-mode-in-progress-hides-implement'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.handleAgentModeChange', 'plan')
  await Command.execute('Chat.openMockSession', 'plan-in-progress', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'make a plan',
      time: '10:00',
    },
    {
      agentMode: 'plan',
      id: 'message-assistant-1',
      inProgress: true,
      role: 'assistant',
      text: '1. Inspect',
      time: '10:01',
    },
  ])

  const implementButton = Locator('.ChatSendAreaBottom .Button[name="implement-plan"]')

  await expect(implementButton).toHaveCount(0)
}
