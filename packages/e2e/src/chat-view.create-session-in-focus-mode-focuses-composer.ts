import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.create-session-in-focus-mode-focuses-composer'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openMockSession('Focus Session', [])
  await Command.execute('Chat.handleClick', 'toggle-chat-focus')

  const focusHeader = Locator('.ChatFocusHeader')
  const focusTitle = Locator('.ChatFocusHeader .ChatHeaderLabel')
  const composer = Locator('.ChatInputBox[name="composer"]')
  const createSessionButton = Locator('.ProjectSidebar [name="create-session-in-project:project-1"]')

  await expect(focusHeader).toBeVisible()
  await expect(focusTitle).toHaveText('Focus Session')
  await expect(createSessionButton).toBeVisible()

  await createSessionButton.click()

  await expect(focusHeader).toBeVisible()
  await expect(focusTitle).toHaveText('Chat 2')
  await expect(composer).toBeFocused()
}
