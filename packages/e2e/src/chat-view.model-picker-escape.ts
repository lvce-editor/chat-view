import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-escape'

export const test: Test = async ({ Chat, expect, KeyBoard, Locator }) => {
  const draftValue = 'draft survives closing the model picker'

  await Chat.show()
  await Chat.reset()
  await Chat.handleInput(draftValue)
  await Chat.handleModelChange('openapi/gpt-4.1-mini')

  const toggleButton = Locator('.ChatSendArea button.ChatSelect[name="model-picker-toggle"]')
  await expect(toggleButton).toContainText('GPT-4.1 Mini')
  await Chat.openModelPicker()

  // act
  await KeyBoard.press('Escape')

  // assert
  const modelPicker = Locator('.ChatModelPicker')
  const composer = Locator('[name="composer"]')
  await expect(modelPicker).toBeHidden()
  await expect(composer).toBeFocused()
  await expect(composer).toHaveValue(draftValue)
  await expect(toggleButton).toContainText('GPT-4.1 Mini')

  await Chat.openModelPicker()
  await expect(modelPicker).toBeVisible()
}
