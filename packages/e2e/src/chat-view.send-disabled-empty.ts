import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.send-disabled-empty'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showSecondarySideBar')

  const composer = Locator('.MultilineInputBox[name="composer"]')
  const sendButton = Locator('.Button[name="send"]')

  await expect(composer).toBeVisible()
  await expect(sendButton).toBeVisible()
  await expect(sendButton).toHaveAttribute('disabled', '')

  await composer.type('hello')
  await expect(sendButton).toHaveAttribute('disabled', null)
}
