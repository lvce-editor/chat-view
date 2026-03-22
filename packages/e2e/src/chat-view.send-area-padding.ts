import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.send-area-padding'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()

  // assert
  const sendArea = Locator('.ChatSendArea')
  await expect(sendArea).toBeVisible()
  await expect(sendArea).toHaveCSS('padding-top', '10px')
  await expect(sendArea).toHaveCSS('padding-right', '8px')
  await expect(sendArea).toHaveCSS('padding-bottom', '10px')
  await expect(sendArea).toHaveCSS('padding-left', '8px')
}
