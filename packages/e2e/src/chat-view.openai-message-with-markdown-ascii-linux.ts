import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-message-with-markdown-ascii-linux'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const linuxArt = ['       .--.', '      |o_o |', '      |:_/ |', '     //   \\ \\', '    (|     | )', "   /'\\_   _/`\\", '   \\___)=(___/'].join(
    '\n',
  )

  const mockText = `Here's an ASCII art depiction of the Linux mascot, Tux the penguin:\n\n\`\`\`\n${linuxArt}\n\`\`\`\n\nIf you meant something else related to Linux, just let me know!`

  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: mockText })
  await Chat.handleInput('show linux ascii art')

  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  const codeBlock = Locator('.ChatMessages .Message pre code')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('show linux ascii art')
  await expect(codeBlock).toHaveCount(1)
  await expect(codeBlock).toHaveText(linuxArt)
}
