import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-debug-view.open-not-found'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  // act
  await Command.execute('Main.openUri', 'chat-debug://not-found')

  // assert
  const errorMessage = Locator('.ChatDebugViewError')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toContainText('No chat session found for sessionId "not-found".')
}
