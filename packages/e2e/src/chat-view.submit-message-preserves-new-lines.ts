import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.submit-message-preserves-new-lines'

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  const multilineInput = 'a\na\na\na\na'
  await Chat.handleInput(multilineInput)
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.first()).toHaveText(multilineInput)
}
