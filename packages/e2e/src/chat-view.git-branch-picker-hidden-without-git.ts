import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.git-branch-picker-hidden-without-git'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()

  await Chat.openMockSession('session-1', [], {
    workspaceUri: `file://${tmpDir}`,
  })
  await Command.execute('Chat.handleClick', 'toggle-chat-focus')

  const toggle = Locator('[name="git-branch-picker-toggle"]')
  await expect(toggle).toHaveCount(0)
}
