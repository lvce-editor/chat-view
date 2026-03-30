import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-search-selects-first-visible-model'

const firstCodexModelId = 'openapi/codex-5.3'
const modelPickerSearchInputName = 'model-picker-search'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.openModelPicker')

  const items = Locator('.ChatModelPicker .ChatModelPickerItem')
  await expect(items).toHaveCount(19)

  const searchInput = Locator('.ChatModelPicker [name="model-picker-search"]')
  await expect(searchInput).toBeVisible()
  await Command.execute('Chat.handleInput', modelPickerSearchInputName, 'codex')
  await expect(searchInput).toHaveValue('codex')

  await expect(items).toHaveCount(2)
  await expect(items.nth(0)).toHaveAttribute('data-id', firstCodexModelId)
  await expect(Locator('.ChatModelPicker .ChatModelPickerItemSelected')).toHaveCount(1)
  await expect(Locator('.ChatModelPicker .ChatModelPickerItemSelected')).toHaveAttribute('data-id', firstCodexModelId)
}
