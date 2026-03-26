import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.agent-mode-picker-visible'

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const agentModeSelect = Locator(`.ChatSendArea .Select[name="agent-mode-picker-toggle"]`)

  await expect(agentModeSelect).toBeVisible()
  await expect(agentModeSelect).toHaveText('Agent')
}
