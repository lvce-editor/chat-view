import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-button-accessible-label'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.handleModelChange('builtin/gpt-5.4')

  const modelPickerToggle = Locator('.ChatSendArea button.ChatSelect[name="model-picker-toggle"]')
  await expect(modelPickerToggle).toBeVisible()
  await expect(modelPickerToggle).toHaveAttribute('aria-label', 'Pick Model, GPT 5.4')
  await expect(modelPickerToggle).toHaveAttribute('title', 'Pick Model, GPT 5.4')
}
