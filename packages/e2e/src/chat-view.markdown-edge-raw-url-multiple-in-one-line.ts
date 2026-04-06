import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.raw-url-multiple-in-one-line'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({
    text: 'References: https://example.com/docs and https://www.gov.uk/guidance and https://[example].com',
  })
  await Chat.handleInput('test multiple raw urls in one line')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const links = Locator('.ChatMessages .Message a')
  await expect(links).toHaveCount(3)
  await expect(links.nth(0)).toHaveAttribute('href', 'https://example.com/docs')
  await expect(links.nth(1)).toHaveAttribute('href', 'https://www.gov.uk/guidance')
  await expect(links.nth(2)).toHaveAttribute('href', 'https://[example].com')
}
