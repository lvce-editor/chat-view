import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-position-and-pointer-selection'

// The pointer offset changes with the matching editor CSS update; enable after that dependency is integrated.
export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openModelPicker()

  const modelPicker = Locator('.ChatModelPicker')
  const toggleButton = Locator('.ChatSendArea button.ChatSelect[name="model-picker-toggle"]')
  const firstModel = Locator('.ChatModelPicker .ChatModelPickerItem[data-id="openapi/gpt-4.1-mini"]')

  await expect(modelPicker).toHaveCSS('margin-bottom', '8px')
  // This regression checks selection from actual pointer coordinates, which the command API bypasses.
  // eslint-disable-next-line e2e/no-direct-click
  await firstModel.click()

  await expect(modelPicker).toHaveCount(0)
  await expect(toggleButton).toContainText('GPT-4.1 Mini')
}
