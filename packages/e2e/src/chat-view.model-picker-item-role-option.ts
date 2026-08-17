import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-item-role-option'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.openModelPicker()

  const pickerList = Locator('.ChatOverlays ul.ChatModelPickerList')
  const items = Locator('.ChatModelPicker .ChatModelPickerItem')
  const optionItems = Locator('.ChatModelPicker .ChatModelPickerItem[role="option"]')
  const selectedItem = Locator('.ChatModelPicker .ChatModelPickerItem[data-id="test"]')

  await expect(pickerList).toHaveAttribute('role', 'listbox')
  await expect(items).toHaveCount(3)
  await expect(optionItems).toHaveCount(3)
  await expect(selectedItem).toHaveAttribute('role', 'option')
}
