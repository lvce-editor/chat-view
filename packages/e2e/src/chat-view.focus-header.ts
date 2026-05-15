import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.focus-header'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const focusHeader = Locator('.ChatFocusHeader')
  const detailHeader = Locator('.ChatHeader')

  await expect(focusHeader).toHaveCount(0)

  await Chat.openMockSession('Focus Session', [])

  await expect(detailHeader).toBeVisible()
  await expect(focusHeader).toHaveCount(0)

  await Command.execute('Chat.handleClick', 'toggle-chat-focus')

  const title = Locator('.ChatFocusHeader .ChatHeaderLabel')
  const projectName = Locator('.ChatFocusHeader .ChatFocusProject')
  const toolbar = Locator('.ChatFocusHeader .ChatFocusActions')
  const addActionButton = Locator('.ChatFocusHeader .Button[name="focus-add-action"]')
  const openInVsCodeButton = Locator('.ChatFocusHeader .Button[name="focus-open-in-vscode"]')
  const commitButton = Locator('.ChatFocusHeader .Button[name="focus-commit"]')
  const openTerminalButton = Locator('.ChatFocusHeader .Button[name="focus-open-terminal"]')
  const showDiffButton = Locator('.ChatFocusHeader .Button[name="focus-show-diff"]')

  await expect(focusHeader).toBeVisible()
  await expect(title).toHaveText('Focus Session')
  await expect(projectName).toHaveText('_blank')
  await expect(toolbar).toHaveAttribute('role', 'toolbar')
  await expect(addActionButton).toBeVisible()
  await expect(addActionButton).toHaveText('Add Action')
  await expect(openInVsCodeButton).toBeVisible()
  await expect(openInVsCodeButton).toHaveText('Open in VSCode')
  await expect(commitButton).toBeVisible()
  await expect(commitButton).toHaveText('Commit')
  await expect(openTerminalButton).toBeVisible()
  await expect(openTerminalButton).toHaveText('Open Terminal')
  await expect(showDiffButton).toBeVisible()
  await expect(showDiffButton).toHaveText('Show Diff')
}
