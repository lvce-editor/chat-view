import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-agent-mode-change'

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const agentModeSelect = Locator(`.ChatSendArea .ChatSelect[name="agent-mode-picker-toggle"]`)

  await Chat.handleAgentModeChange('plan')

  await expect(agentModeSelect).toHaveText('Plan')
}
