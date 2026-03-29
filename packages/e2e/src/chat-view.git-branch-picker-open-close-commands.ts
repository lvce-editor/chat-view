import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.git-branch-picker-open-close-commands'

const repoRoot = decodeURIComponent(new URL('../../..', import.meta.url).pathname)

export const test: Test = async ({ Chat, Command, expect, Locator, Workspace }) => {
  await Workspace.setPath(repoRoot)
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-1', [], {
    branchName: 'main',
    workspaceUri: `file://${repoRoot}`,
  })
  await Command.execute('Chat.handleClick', 'toggle-chat-focus')

  await Command.execute('Chat.openGitBranchPicker')
  const picker = Locator('.ChatGitBranchPicker')
  await expect(picker).toBeVisible()

  await Command.execute('Chat.closeGitBranchPicker')
  await expect(picker).toHaveCount(0)
}
