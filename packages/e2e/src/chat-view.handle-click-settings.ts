import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-input-script'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.reset()

  // act
  await Chat.handleClickSettings()

  // assert
  const tab = Locator('.MainTab[title="app://settings.json"]')
  await expect(tab).toBeVisible()
}
