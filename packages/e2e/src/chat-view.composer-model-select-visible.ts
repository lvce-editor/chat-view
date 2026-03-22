import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.composer-model-select-visible'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()

  // assert
  const modelSelect = Locator('.ChatSendArea .Select[name="model"]')
  await expect(modelSelect).toBeVisible()
}
