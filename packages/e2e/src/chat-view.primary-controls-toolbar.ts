import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.primary-controls-toolbar'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()

  // assert
  const primaryControls = Locator('.ChatSendAreaPrimaryControls')
  await expect(primaryControls).toBeVisible()
  await expect(primaryControls).toHaveAttribute('role', 'toolbar')
}
