import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.invalid-heading-no-space'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({ text: '##HeadingWithoutSpace' })
  await Chat.handleInput('invalid heading no space')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const headings = Locator(
    '.ChatMessages .Message h1, .ChatMessages .Message h2, .ChatMessages .Message h3, .ChatMessages .Message h4, .ChatMessages .Message h5, .ChatMessages .Message h6',
  )
  await expect(headings).toHaveCount(0)
  const assistant = Locator('.ChatMessages .Message').nth(1)
  await expect(assistant).toContainText('##HeadingWithoutSpace')
}
