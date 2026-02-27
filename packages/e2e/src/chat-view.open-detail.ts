import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.open-detail'

export const skip = 1

export const test: Test = async ({ expect, Locator }) => {
  const session = Locator('.ChatList .ChatName[name="session:session-1"]')
  await expect(session).toBeVisible()
  await session.click()

  const backButton = Locator('.ChatHeader .IconButton[name="back"]')
  await expect(backButton).toBeVisible()

  const chatDetails = Locator('.ChatDetails')
  await expect(chatDetails).toBeVisible()
}