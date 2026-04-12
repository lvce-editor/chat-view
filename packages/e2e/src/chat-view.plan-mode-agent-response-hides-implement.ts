import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.plan-mode-agent-response-hides-implement'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.handleAgentModeChange', 'plan')
  await Command.execute('Chat.openMockSession', 'plan-suppressed-by-later-agent-reply', [
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
      text: '1. Inspect\n2. Change\n3. Verify',
      time: '10:01',
    },
    {
      id: 'message-user-2',
      role: 'user',
      text: 'implement it',
      time: '10:02',
    },
    {
      agentMode: 'agent',
      id: 'message-assistant-2',
      role: 'assistant',
      text: '1. I already executed the steps\n2. Here is the result',
      time: '10:03',
    },
  ])

  const implementButton = Locator('.ChatSendAreaBottom .Button[name="implement-plan"]')

  await expect(implementButton).toHaveCount(0)
}
