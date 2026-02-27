import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.clear-input'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showSecondarySideBar')

  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  await Command.execute('Chat.handleInput', 'hello from script input', 'script')
  await expect(composer).toHaveValue('hello from script input')

  await Command.execute('Chat.clearInput')

  await expect(composer).toHaveValue('')
}
