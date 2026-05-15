import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.add-context-button-visible'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setAddContextButtonEnabled', true)

  const addContextButton = Locator('.ChatSendArea .IconButton[name="add-context"]')
  await expect(addContextButton).toBeVisible()
}
