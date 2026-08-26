import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.file-drop-overlay-active'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.openMockSession('session-file-drop-overlay-active', [])

  const composer = Locator('.ChatInputBox[name="composer"]')
  const dropOverlay = Locator('.ChatViewDropOverlay.ChatViewDropOverlayActive')

  await expect(composer).toBeVisible()

  await Command.execute('Chat.handleDragOver', 'composer-drop-target', true)

  await expect(dropOverlay).toBeVisible()
  await expect(dropOverlay).toHaveText('Attach Image as Context')
  await expect(dropOverlay).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.1)')

  await Command.execute('Chat.handleDragLeave', 'composer-drop-target')

  await expect(dropOverlay).toBeHidden()
}
