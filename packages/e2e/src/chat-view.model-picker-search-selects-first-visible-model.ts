import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-search-selects-first-visible-model'

const firstCodexModelId = 'openapi/codex-5.3'
const modelPickerSearchInputName = 'model-picker-search'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.openModelPicker()

  const items = Locator('.ChatModelPicker .ChatModelPickerItem')
  await expect(items).toHaveCount(3)

  const searchInput = Locator('.ChatModelPicker [name="model-picker-search"]')
  await expect(searchInput).toBeVisible()
  await Command.execute('Chat.handleInput', modelPickerSearchInputName, 'gpt')
  await expect(searchInput).toHaveValue('gpt')

  await expect(items).toHaveCount(2)
  const item0 = items.nth(0)
  await expect(item0).toHaveAttribute('data-id', 'builtin/gpt-5.4')
  const selectedItem = Locator('.ChatModelPicker .ChatModelPickerItemSelected')
  await expect(selectedItem).toHaveCount(1)
  await expect(selectedItem).toHaveAttribute('data-id', 'builtin/gpt-5.4')
}
