import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.link-relative-file-path'
export const skip = 1

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({ text: 'Files added: [src/index.ts](src/index.ts)' })
  await Chat.handleInput('list added files as links')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const links = Locator('.ChatMessages .Message a')
  await expect(links).toHaveCount(1)
  await expect(links).toHaveAttribute('data-uri', 'file:///workspace/src/index.ts')
  await expect(links).toHaveAttribute('href', '#')
}
