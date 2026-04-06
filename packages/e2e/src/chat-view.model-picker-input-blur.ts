import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-input-blur'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.openModelPicker()

  // act
  await Chat.handleModelInputBlur()

  // assert
  const modelPicker = Locator('.ChatModelPicker')
  await expect(modelPicker).toBeHidden()
  const composerInput = Locator('[name="composer"]')
  await expect(composerInput).toBeFocused()
}
