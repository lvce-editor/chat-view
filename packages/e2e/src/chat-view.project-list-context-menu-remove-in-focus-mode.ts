import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.project-list-context-menu-remove-in-focus-mode'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockProject', 'project-2', 'workspace', 'file:///workspace')
  await Command.execute('Chat.handleClick', 'create-session-in-project:project-2')
  await Command.execute('Chat.handleClick', 'toggle-chat-focus')

  const projectLabels = Locator('.ProjectList .ProjectListItemLabel')
  const focusProject = Locator('.ChatFocusHeader .ChatFocusProject')
  await expect(projectLabels).toHaveCount(2)
  await expect(projectLabels.nth(1)).toHaveText('▾workspace')
  await expect(focusProject).toHaveText('workspace')

  await Command.execute('Chat.handleProjectListContextMenu', 0, 100, 100)

  const newChatMenuItem = Locator('.MenuItem').nth(0)
  const addProjectMenuItem = Locator('.MenuItem').nth(1)
  const removeProjectMenuItem = Locator('.MenuItem').nth(2)
  await expect(newChatMenuItem).toHaveText('New Chat')
  await expect(addProjectMenuItem).toHaveText('Add Project')
  await expect(removeProjectMenuItem).toHaveText('Remove Project')

  await Command.execute('Chat.handleClick', 'ProjectDelete', 'project-2')

  await expect(projectLabels).toHaveCount(1)
  await expect(projectLabels.nth(0)).toHaveText('▾_blank')
  await expect(focusProject).toHaveText('_blank')
}
