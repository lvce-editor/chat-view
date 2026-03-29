import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-button-accessible-label'

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.handleModelChange('openapi/gpt-5.4-mini')

  const modelPickerToggle = Locator('.ChatSendArea button.Select[name="model-picker-toggle"]')
  await expect(modelPickerToggle).toBeVisible()
  await expect(modelPickerToggle).toHaveAttribute('aria-label', 'Pick Model, GPT-5.4 Mini')
  await expect(modelPickerToggle).toHaveAttribute('title', 'Pick Model, GPT-5.4 Mini')
}
