import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.stop-button-visible-while-streaming'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.openMockSession', 'stop-button-visible', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'hello from e2e',
      time: '10:00',
    },
    {
      id: 'message-assistant-1',
      role: 'assistant',
      text: 'partial response',
      time: '10:01',
    },
  ])
  await Command.execute('Chat.setInProgress', true)

  const stopButton = Locator('.IconButton[name="stop"]')
  const stopIcon = Locator('.IconButton[name="stop"] .MaskIconDebugPause')
  const sendButton = Locator('.IconButton[name="send"]')

  await expect(stopButton).toBeVisible()
  await expect(stopButton).toHaveAttribute('aria-label', 'stop')
  await expect(stopButton).not.toHaveAttribute('title', 'stop')
  await expect(stopIcon).toBeVisible()

  await stopButton.click()
  await expect(stopButton).toBeHidden()
  await expect(sendButton).toBeVisible()
}
