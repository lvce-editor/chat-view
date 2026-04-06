import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.code-block-data-lang'

export const skip = 1
export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({
    text: ['```ts', 'const answer = 42', '```', '', '```', 'plain code', '```'].join('\n'),
  })
  await Chat.handleInput('show code blocks')
  await Chat.handleSubmit()
  await Chat.rerender()

  const preBlocks = Locator('.ChatMessages .Message pre')
  const codeBlocks = Locator('.ChatMessages .Message pre code')

  await expect(preBlocks).toHaveCount(2)
  await expect(codeBlocks).toHaveCount(2)
  await expect(preBlocks.nth(0)).toHaveAttribute('data-lang', 'ts')
  await expect(codeBlocks.nth(0)).toHaveAttribute('data-lang', 'ts')
  await expect(preBlocks.nth(1)).toHaveAttribute('data-lang', null)
  await expect(codeBlocks.nth(1)).toHaveAttribute('data-lang', null)
}
