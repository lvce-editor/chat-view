import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.raw-url-subdomain-gov-uk'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', {
    text: 'Info page https://service.gov.uk/department/ministry-of-justice',
  })
  await Chat.handleInput('test raw subdomain gov uk url')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const links = Locator('.ChatMessages .Message a')
  await expect(links).toHaveCount(1)
  await expect(links).toHaveAttribute('href', 'https://service.gov.uk/department/ministry-of-justice')
}
