import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.git-branch-picker-visible'

const repoRoot = decodeURIComponent(new URL('../../..', import.meta.url).pathname)

export const test: Test = async ({ Chat, Command, expect, Locator, Workspace }) => {
  await Workspace.setPath(repoRoot)
  await Chat.show()
  await Chat.reset()

  // @ts-ignore
  await Chat.openMockSession('session-1', [], {
    branchName: 'main',
    workspaceUri: `file://${repoRoot}`,
  })
  await Command.execute('Chat.handleClick', 'toggle-chat-focus')

  const focusRoot = Locator('.Chat.ChatFocus')
  await expect(focusRoot).toBeVisible()

  const toggle = Locator('[name="git-branch-picker-toggle"]')
  await expect(toggle).toBeVisible()
  await expect(toggle).toContainText('main')
}
