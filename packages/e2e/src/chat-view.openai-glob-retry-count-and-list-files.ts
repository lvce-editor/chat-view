import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-glob-retry-count-and-list-files'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  const workspaceUri = 'file:///playground'
  const files = [
    'README.md',
    'index.html',
    'languages/index.cpp',
    'languages/index.css',
    'languages/index.csv',
    'languages/index.dart',
    'languages/index.env',
    'languages/index.ex',
    'languages/index.go',
    'languages/index.html',
    'languages/index.java',
    'languages/index.jl',
    'languages/index.js',
    'languages/index.json',
    'languages/index.kt',
    'languages/index.pl',
    'languages/index.py',
    'languages/index.rb',
    'languages/index.rs',
    'languages/index.ts',
    'languages/scrolling.txt',
    'languages/tsconfig.json',
    'sample-folder/a.txt',
    'sample-folder/b.txt',
  ] as const
  const globResult = JSON.stringify({
    files: files.map((file) => `${workspaceUri}/${file}`),
  })
  const invalidBaseUriError = 'Invalid argument: baseUri must be an absolute URI.'

  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-openai-glob-retry-count-and-list-files', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'how many files in this repo? answer with number only, use glob tool to match all.',
      time: '02:36 AM',
    },
    {
      id: 'message-assistant-1',
      inProgress: false,
      role: 'assistant',
      text: '24',
      time: '02:36 AM',
      toolCalls: [
        {
          arguments: '{}',
          id: 'call_01',
          name: 'getWorkspaceUri',
          result: workspaceUri,
          status: 'success',
        },
        {
          arguments: JSON.stringify({
            baseUri: 'playground',
            pattern: '**/*',
          }),
          errorMessage: invalidBaseUriError,
          id: 'call_02',
          name: 'glob',
          status: 'error',
        },
        {
          arguments: JSON.stringify({
            baseUri: workspaceUri,
            pattern: '**/*',
          }),
          id: 'call_03',
          name: 'glob',
          result: globResult,
          status: 'success',
        },
      ],
    },
    {
      id: 'message-user-2',
      role: 'user',
      text: 'what are the files',
      time: '02:36 AM',
    },
    {
      id: 'message-assistant-2',
      inProgress: false,
      role: 'assistant',
      text: ['Here are the files:', '', ...files.map((file) => `- ${file}`)].join('\n'),
      time: '02:36 AM',
      toolCalls: [
        {
          arguments: '{}',
          id: 'call_04',
          name: 'getWorkspaceUri',
          result: workspaceUri,
          status: 'success',
        },
        {
          arguments: JSON.stringify({
            query: '**/*',
          }),
          errorMessage: invalidBaseUriError,
          id: 'call_05',
          name: 'glob',
          status: 'error',
        },
        {
          arguments: JSON.stringify({
            baseUri: workspaceUri,
            pattern: '**/*',
          }),
          id: 'call_06',
          name: 'glob',
          result: globResult,
          status: 'success',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(6)
  await expect(messages.nth(0)).toHaveText('how many files in this repo? answer with number only, use glob tool to match all.')

  const firstToolCallMessage = messages.nth(1)
  const firstToolCalls = firstToolCallMessage.locator('.ChatOrderedListItem')
  await expect(firstToolCalls).toHaveCount(3)
  await expect(firstToolCallMessage).toContainText('get_workspace_uri playground')
  await expect(firstToolCallMessage).toContainText('glob playground (error: Invalid argument: baseUri must be an absolute URI.)')
  await expect(firstToolCallMessage).toContainText('glob playground, 24 matches')

  await expect(messages.nth(2)).toHaveText('24')
  await expect(messages.nth(3)).toHaveText('what are the files')

  const secondToolCallMessage = messages.nth(4)
  const secondToolCalls = secondToolCallMessage.locator('.ChatOrderedListItem')
  await expect(secondToolCalls).toHaveCount(3)
  await expect(secondToolCallMessage).toContainText('get_workspace_uri playground')
  await expect(secondToolCallMessage).toContainText('glob "**/*" (error: Invalid argument: baseUri must be an absolute URI.)')
  await expect(secondToolCallMessage).toContainText('glob playground, 24 matches')

  const assistantReply = messages.nth(5)
  const fileItems = assistantReply.locator('li')
  await expect(fileItems).toHaveCount(24)
  await expect(assistantReply).toContainText('Here are the files:')
  await expect(fileItems.nth(0)).toHaveText('README.md')
  await expect(fileItems.nth(1)).toHaveText('index.html')
  await expect(fileItems.nth(20)).toHaveText('languages/scrolling.txt')
  await expect(fileItems.nth(23)).toHaveText('sample-folder/b.txt')
}
