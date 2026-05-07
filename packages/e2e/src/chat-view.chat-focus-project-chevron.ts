import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-focus-project-chevron'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.loadContent', {})
  await Command.execute('Chat.resize', { height: 600, width: 800 })
  await Chat.openMockSession('session-1', [])
  await Chat.handleClickBack()

  const toggleChatFocusButton = Locator('.IconButton[name="toggle-chat-focus"]')
  await expect(toggleChatFocusButton).toBeVisible()
  await Command.execute('Chat.handleClick', 'toggle-chat-focus')

  const projectLabels = Locator('.ProjectListItemLabel')
  const projectLabel = projectLabels.nth(0)
  const projectChevron = projectLabel.locator('.ProjectListChevron')

  await expect(projectLabels).toHaveCount(1)
  await expect(projectChevron).toHaveClass('ProjectListChevron MaskIcon MaskIconChevronDown')

  await Command.execute('Chat.handleClick', 'project:project-1')
  await expect(projectChevron).toHaveClass('ProjectListChevron MaskIcon MaskIconChevronRight')

  await Command.execute('Chat.handleClick', 'project:project-1')
  await expect(projectChevron).toHaveClass('ProjectListChevron MaskIcon MaskIconChevronDown')
}
