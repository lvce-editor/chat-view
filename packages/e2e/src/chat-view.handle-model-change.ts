import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-model-change'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const modelSelect = Locator('.ChatSendArea .Select[name="model"]')

  // act
  await Chat.handleModelChange('openapi/gpt-4.1-mini')

  // assert
  await expect(modelSelect).toHaveValue('openapi/gpt-4.1-mini')
}
