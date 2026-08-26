import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.one-message'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.handleInput('hello from e2e')
  await Chat.handleSubmit()

  // act
  await Chat.handleClickBack()

  // assert
  const item = Locator('.ChatListItem')
  await expect(item).toHaveCount(1)
  const title = item.locator('.ChatListItemTitle')
  await expect(title).toHaveText('hello from e2e')
  const subtitle = item.locator('.ChatListItemTime')
  await expect(subtitle).toBeVisible()
}
