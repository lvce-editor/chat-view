import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-click-debug'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.reset()

  // act
  await Chat.handleClickSessionDebug()

  // assert
  const tab = Locator('.MainTab[title*="chat-debug"]')
  await expect(tab).toBeVisible()
}
