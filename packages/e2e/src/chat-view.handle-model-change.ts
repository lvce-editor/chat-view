import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-model-change'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const modelSelect = Locator('.ChatSendArea .Select')

  // act
  await Chat.handleModelChange('abc')

  // assert
  await expect(modelSelect).toHaveText('abc')
}
