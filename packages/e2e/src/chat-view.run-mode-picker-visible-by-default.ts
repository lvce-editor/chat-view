import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.run-mode-picker-visible-by-default'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const runModePicker = Locator('.ChatSendArea select.Select[name="runMode"]')
  await expect(runModePicker).toBeVisible()
  await expect(runModePicker).toHaveValue('local')

  await Command.execute('Chat.handleRunModeChange', 'background')
  await expect(runModePicker).toHaveValue('background')
}
