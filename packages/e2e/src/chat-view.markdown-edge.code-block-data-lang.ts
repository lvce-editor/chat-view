import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.code-block-data-lang'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', {
    text: ['```ts', 'const answer = 42', '```', '', '```', 'plain code', '```'].join('\n'),
  })
  await Chat.handleInput('show code blocks')
  await Chat.handleSubmit()
  await Chat.rerender()

  const preBlocks = Locator('.ChatMessages .Message pre')
  const codeBlocks = Locator('.ChatMessages .Message pre code')

  await expect(preBlocks).toHaveCount(2)
  await expect(codeBlocks).toHaveCount(2)
  const preBlock0 = preBlocks.nth(0)
  await expect(preBlock0).toHaveAttribute('data-lang', 'ts')
  const codeBlock0 = codeBlocks.nth(0)
  await expect(codeBlock0).toHaveAttribute('data-lang', 'ts')
  const preBlock1 = preBlocks.nth(1)
  await expect(preBlock1).toHaveAttribute('data-lang', null)
  const codeBlock1 = codeBlocks.nth(1)
  await expect(codeBlock1).toHaveAttribute('data-lang', null)
}
