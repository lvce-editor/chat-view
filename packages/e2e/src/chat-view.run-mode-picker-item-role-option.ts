import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.run-mode-picker-item-role-option'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.handleClick', 'run-mode-picker-toggle')

  const pickerList = Locator('.ChatOverlays ul.ChatModelPickerList')
  const options = Locator('.ChatOverlays ul.ChatModelPickerList > li[role="option"]')
  const localOption = Locator('.ChatOverlays .ChatModelPickerItem[name="run-mode-picker-item:local"]')
  const backgroundOption = Locator('.ChatOverlays .ChatModelPickerItem[name="run-mode-picker-item:background"]')
  const cloudOption = Locator('.ChatOverlays .ChatModelPickerItem[name="run-mode-picker-item:cloud"]')

  await expect(pickerList).toHaveAttribute('role', 'listbox')
  await expect(options).toHaveCount(3)
  await expect(localOption).toHaveAttribute('role', 'option')
  await expect(backgroundOption).toHaveAttribute('role', 'option')
  await expect(cloudOption).toHaveAttribute('role', 'option')
}
