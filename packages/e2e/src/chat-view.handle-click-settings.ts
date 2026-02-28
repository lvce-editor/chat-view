import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.handle-input-script'

// export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Layout.showSecondarySideBar')
  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()
  await Command.execute('Chat.reset')

  // act
  await Command.execute('Chat.handleClickSettings')

  // assert
  const tab = Locator('.MainTab[title="app://settings.json"]')
  await expect(tab).toBeVisible()
}
