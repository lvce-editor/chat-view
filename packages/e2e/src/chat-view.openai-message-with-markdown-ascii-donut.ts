import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-message-with-markdown-ascii-donut'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const donutArt = [
    '        _..----.._',
    "      .'          '.",
    '     /              \\',
    '    |                |',
    '    |                |',
    '     \\              /',
    "      '._        _.'",
    "         `'----'`",
  ].join('\n')

  const mockText = `Here\u{2019}s an ASCII art representation of a donut:\n\n\`\`\`\n${donutArt}\n\`\`\`\n\nFeel free to let me know if you\u{2019}d like something different!`

  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: mockText })
  await Chat.handleInput('draw an ascii donut')

  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  const codeBlock = Locator('.ChatMessages .Message pre code')
  await expect(messages).toHaveCount(2)
  const message0 = messages.nth(0)
  await expect(message0).toHaveText('draw an ascii donut')
  await expect(codeBlock).toHaveCount(1)
  await expect(codeBlock).toHaveText(donutArt)
}
