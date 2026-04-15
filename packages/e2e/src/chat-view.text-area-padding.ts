import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.text-area-padding'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.ChatInputBox[name="composer"]')

  // assert
  await expect(composer).toBeVisible()
  await expect(composer).toHaveCSS('padding-left', '0px')
  await expect(composer).toHaveCSS('padding-right', '0px')
}
