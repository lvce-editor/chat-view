import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-file-link.in-unordered-list'
export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', {
    text: 'Files added:\n- [doodle-jump/index.html](doodle-jump/index.html)\n- [doodle-jump/style.css](doodle-jump/style.css)\n- [doodle-jump/game.js](doodle-jump/game.js)',
  })
  await Chat.handleInput('list added files as links')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const links = Locator('.ChatMessages .Message a')
  await expect(links).toHaveCount(3)
  await expect(links.nth(0)).toHaveAttribute('data-uri', 'file:///workspace/doodle-jump/index.html')
  await expect(links.nth(1)).toHaveAttribute('data-uri', 'file:///workspace/doodle-jump/style.css')
  await expect(links.nth(2)).toHaveAttribute('data-uri', 'file:///workspace/doodle-jump/game.js')
}
