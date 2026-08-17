import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-has-expected-models'

const expectedModelIds = ['builtin/gpt-5.4', 'builtin/gpt-4.1', 'test'] as const

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.openModelPicker()

  for (const modelId of expectedModelIds) {
    const modelItem = Locator(`.ChatModelPicker .ChatModelPickerItem[data-id="${modelId}"]`)
    await expect(modelItem).toHaveCount(1)
  }
}
