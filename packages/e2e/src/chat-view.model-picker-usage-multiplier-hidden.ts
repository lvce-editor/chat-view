import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-usage-multiplier-hidden'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setShowModelUsageMultiplier', false)
  await Chat.openModelPicker()

  const modelPicker = Locator('.ChatModelPicker')
  const usageMultipliers = Locator('.ChatModelPicker .ChatModelPickerItemUsageCost')

  await expect(modelPicker).toBeVisible()
  await expect(usageMultipliers).toHaveCount(0)
}
