import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.chat-list-item-actions-toolbar'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.handleInput('first session message')
  await Chat.handleSubmit()
  await Chat.handleClickBack()

  const actionsToolbar = Locator('.ChatList .ChatListItem .ChatActions')

  await expect(actionsToolbar).toHaveCount(1)
  await expect(actionsToolbar).toHaveAttribute('role', 'toolbar')
}
