import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.git-branch-picker-switch-error'

const repoRoot = decodeURIComponent(new URL('../../..', import.meta.url).pathname)

export const test: Test = async ({ Chat, Command, expect, Locator, Workspace }) => {
  await Workspace.setPath(repoRoot)
  await Chat.show()
  await Chat.reset()

  await Chat.openMockSession('session-1', [], {
    branchName: 'main',
    workspaceUri: `file://${repoRoot}`,
  })
  await Command.execute('Chat.handleClick', 'toggle-chat-focus')

  await Command.execute('Chat.openGitBranchPicker')
  await Command.execute('Chat.handleClick', 'git-branch-picker-item:main')

  const errorMessage = Locator('.ChatGitBranchPickerErrorMessage')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toContainText('Failed to switch to branch "')
}
