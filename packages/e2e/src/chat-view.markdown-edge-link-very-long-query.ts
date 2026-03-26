/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.link-very-long-query'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const longQuery = `q=${'searchterm-'.repeat(400)}`
  const longUrl = `https://example.com/find?${longQuery}`
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: `[Search giant query](${longUrl})` })
  await Chat.handleInput('test markdown url with very long query string')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const links = Locator('.ChatMessages .Message a')
  await expect(links).toHaveCount(1)
  await expect(links).toHaveAttribute('href', longUrl)
}
