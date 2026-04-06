import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.link-vscode-references-uri'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({ text: 'Open [main.ts](vscode-references:///workspace/src/main.ts)' })
  await Chat.handleInput('show file')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const links = Locator('.ChatMessages .Message a')
  await expect(links).toHaveCount(1)
  await expect(links).toHaveAttribute('data-uri', 'vscode-references:///workspace/src/main.ts')
  await expect(links).toHaveAttribute('href', '#')
}
