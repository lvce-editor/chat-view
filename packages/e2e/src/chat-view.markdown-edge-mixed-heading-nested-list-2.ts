import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.mixed-heading-nested-list-2'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: "### Tasks\n\n- Infra\n  1. Terraform\n  2. Policies\n- App" })
  await Chat.handleInput("mixed markdown 2")

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const heading = Locator('.ChatMessages .Message h3')
  const unordered = Locator('.ChatMessages .Message ul')
  const ordered = Locator('.ChatMessages .Message ol')
  await expect(heading).toHaveCount(1)
  await expect(unordered).toHaveCount(1)
  await expect(ordered).toHaveCount(1)
}
