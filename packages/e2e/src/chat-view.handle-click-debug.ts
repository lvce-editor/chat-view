import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-click-debug'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Chat.reset()

  // act
  await Command.execute('Chat.handleClickSessionDebug')

  // assert
  const tab = Locator('.MainTab[title*="chat-debug"]')
  await expect(tab).toBeVisible()
}
