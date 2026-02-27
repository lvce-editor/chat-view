import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-input-script'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Chat.setChatList', 1)

  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  await Command.execute('Chat.handleInput', 'hello from script input', 'script')

  await expect(composer).toHaveValue('hello from script input')
}
