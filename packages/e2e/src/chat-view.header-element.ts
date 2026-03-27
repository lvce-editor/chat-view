import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.header-element'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()

  // assert
  const header = Locator('.ChatHeader')
  await expect(header).toBeVisible()
  await expect(header).toHaveJSProperty('tagName', 'HEADER')
}
