import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.composer-spellcheck-disabled'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  const composer = Locator('.ChatInputBox[name="composer"]')

  // assert
  await expect(composer).toHaveAttribute('spellcheck', 'false')
}
