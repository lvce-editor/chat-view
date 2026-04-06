import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-file-size-report-many-tool-calls'

export const test: Test = async ({ Chat, expect, Locator }) => {
  const workspaceUri = 'file:///playground'
  const languagesUri = `${workspaceUri}/languages`
  const languageFiles = [
    ['index.cpp', 196],
    ['index.css', 310],
    ['index.dart', 41],
    ['index.env', 6],
    ['index.ex', 256],
    ['index.go', 74],
    ['index.html', 32],
    ['index.java', 110],
    ['index.jl', 191],
    ['index.js', 40],
    ['index.kt', 61],
    ['index.pl', 179],
    ['index.py', 526],
    ['index.rb', 88],
    ['index.rs', 102],
    ['index.ts', 56],
    ['scrolling.txt', 791],
  ] as const

  const totalBytes = languageFiles.reduce((total, [, size]) => total + size, 0)
  const totalKiB = (totalBytes / 1024).toFixed(1)

  await Chat.show()
  await Chat.reset()

  await Chat.openMockSession('session-file-size-report-many-tool-calls', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'whats the file sizes of the files?',
      time: '11:50 AM',
    },
    {
      id: 'message-assistant-1',
      inProgress: false,
      role: 'assistant',
      text: [
        `I found ${languageFiles.length} files under /playground/languages. Here are their sizes in bytes, based on the current text content I could read:`,
        '',
        ...languageFiles.map(([fileName, size]) => `- ${fileName} - ${size} B`),
        '',
        `Total: about ${totalBytes.toLocaleString('en-US')} bytes (~${totalKiB} KiB).`,
      ].join('\n'),
      time: '11:50 AM',
      toolCalls: [
        {
          arguments: '{}',
          id: 'call_01',
          name: 'getWorkspaceUri',
          result: workspaceUri,
          status: 'success',
        },
        {
          arguments: JSON.stringify({ uri: workspaceUri }),
          id: 'call_02',
          name: 'list_files',
          status: 'success',
        },
        {
          arguments: JSON.stringify({ uri: languagesUri }),
          id: 'call_03',
          name: 'list_files',
          status: 'success',
        },
        ...languageFiles.map(([fileName], index) => ({
          arguments: JSON.stringify({ path: `languages/${fileName}` }),
          id: `call_${String(index + 4).padStart(2, '0')}`,
          name: 'read_file',
          status: 'success' as const,
        })),
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(3)
  await expect(messages.nth(0)).toHaveText('whats the file sizes of the files?')

  const toolCallMessage = messages.nth(1)
  const orderedToolCalls = toolCallMessage.locator('.ChatOrderedListItem')
  await expect(orderedToolCalls).toHaveCount(20)
  await expect(toolCallMessage).toContainText('get_workspace_uri playground')
  await expect(toolCallMessage).toContainText('list_files playground')
  await expect(toolCallMessage).toContainText('list_files languages')
  await expect(toolCallMessage).toContainText('read_file index.cpp')
  await expect(toolCallMessage).toContainText('read_file scrolling.txt')
  await expect(toolCallMessage).toContainText('read_file index.rs')

  const assistantReply = messages.nth(2)
  await expect(assistantReply).toContainText('I found 17 files under /playground/languages.')
  await expect(assistantReply).toContainText('index.cpp - 196 B')
  await expect(assistantReply).toContainText('index.py - 526 B')
  await expect(assistantReply).toContainText('scrolling.txt - 791 B')
  await expect(assistantReply).toContainText('Total: about 3,059 bytes (~3.0 KiB).')
}
