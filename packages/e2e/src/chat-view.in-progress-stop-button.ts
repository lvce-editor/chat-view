import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.in-progress-stop-button'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.openMockSession', 'session-1', [{ id: 'message-1', role: 'user', text: 'hello', time: '10:00' }])
  await Command.execute('Chat.setInProgress', true)
  await Chat.rerender()

  const stopButton = Locator('.Button[name="stop"]')

  await expect(stopButton).toBeVisible()
}
