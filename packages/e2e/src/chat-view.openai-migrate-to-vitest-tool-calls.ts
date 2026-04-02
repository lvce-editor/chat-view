<<<<<<< HEAD
 
=======
>>>>>>> origin/main
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-migrate-to-vitest-tool-calls'

const toolCalls = [
  {
    arguments: '{}',
    id: 'call_01',
    name: 'getWorkspaceUri',
    result: 'file:///explorer-view',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ uri: 'file:///explorer-view' }),
    id: 'call_02',
    name: 'list_files',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'package.json' }),
    id: 'call_03',
    name: 'read_file',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'packages' }),
    id: 'call_04',
    name: 'list_files',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'explorer-view' }),
    id: 'call_05',
    name: 'list_files',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'package.json' }),
    id: 'call_06',
    name: 'read_file',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'test' }),
    id: 'call_07',
    name: 'list_files',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'Main.test.ts' }),
    id: 'call_08',
    name: 'read_file',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'build' }),
    id: 'call_09',
    name: 'list_files',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'package.json' }),
    id: 'call_10',
    name: 'read_file',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'server' }),
    id: 'call_11',
    name: 'list_files',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'package.json' }),
    id: 'call_12',
    name: 'read_file',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ includeIgnoredFiles: false, includePattern: '**', isRegexp: false, maxResults: 10, query: '@jest/globals' }),
    id: 'call_13',
    name: 'grep_search',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ includeIgnoredFiles: false, includePattern: '**', isRegexp: false, maxResults: 10, query: 'jest.' }),
    id: 'call_14',
    name: 'grep_search',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ includeIgnoredFiles: false, includePattern: '**', isRegexp: false, maxResults: 10, query: 'import jest' }),
    id: 'call_15',
    name: 'grep_search',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'Terminal.test.ts' }),
    id: 'call_16',
    name: 'read_file',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'tsconfig.json' }),
    id: 'call_17',
    name: 'read_file',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'getFileHandleText.test.ts' }),
    id: 'call_18',
    name: 'read_file',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ includeIgnoredFiles: false, includePattern: '**', isRegexp: false, maxResults: 10, query: 'jest.fn' }),
    id: 'call_19',
    name: 'grep_search',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ content: '{"name":"explorer-view"}', path: 'package.json' }),
    id: 'call_20',
    name: 'write_file',
    result: JSON.stringify({ linesAdded: 0, linesDeleted: 0, ok: true, path: 'package.json' }),
    status: 'success',
  },
  {
    arguments: JSON.stringify({ content: "import { defineConfig } from 'vitest/config'\n", path: 'vitest.config.ts' }),
    id: 'call_21',
    name: 'write_file',
    result: JSON.stringify({ linesAdded: 0, linesDeleted: 0, ok: true, path: 'vitest.config.ts' }),
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'test' }),
    id: 'call_22',
    name: 'list_files',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ content: "import { defineConfig } from 'vitest/config'\n", path: 'vitest.config.ts' }),
    id: 'call_23',
    name: 'write_file',
    result: JSON.stringify({ linesAdded: 0, linesDeleted: 0, ok: true, path: 'vitest.config.ts' }),
    status: 'success',
  },
  {
    arguments: JSON.stringify({
      content: "export { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest'\nexport const jest = vi\n",
      path: 'jest-globals-shim.ts',
    }),
    id: 'call_24',
    name: 'write_file',
    result: JSON.stringify({ linesAdded: 0, linesDeleted: 0, ok: true, path: 'jest-globals-shim.ts' }),
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'e2e' }),
    id: 'call_25',
    name: 'list_files',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ path: 'package.json' }),
    id: 'call_26',
    name: 'read_file',
    status: 'success',
  },
  {
    arguments: JSON.stringify({ includeIgnoredFiles: false, includePattern: '**', isRegexp: false, maxResults: 10, query: 'jest' }),
    id: 'call_27',
    name: 'grep_search',
    status: 'success',
  },
] as const

const expectedToolCallLabels = [
  'get_workspace_uri explorer-view',
  'list_files explorer-view',
  'read_file package.json',
  'list_files packages',
  'list_files explorer-view',
  'read_file package.json',
  'list_files test',
  'read_file Main.test.ts',
  'list_files build',
  'read_file package.json',
  'list_files server',
  'read_file package.json',
  'grep_search "@jest/globals"',
  'grep_search "jest."',
  'grep_search "import jest"',
  'read_file Terminal.test.ts',
  'read_file tsconfig.json',
  'read_file getFileHandleText.test.ts',
  'grep_search "jest.fn"',
  'write_file package.json +0 -0',
  'write_file vitest.config.ts +0 -0',
  'list_files test',
  'write_file vitest.config.ts +0 -0',
  'write_file jest-globals-shim.ts +0 -0',
  'list_files e2e',
  'read_file package.json',
  'grep_search "jest"',
] as const

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-openai-migrate-to-vitest-tool-calls', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'lets migrate from jest to vitest please',
      time: '10:14 AM',
    },
    {
      id: 'message-assistant-1',
      inProgress: false,
      role: 'assistant',
      text: [
        'Done — I started the migration from Jest to Vitest for the explorer-view package and left the test suite itself untouched (no mass edits of ~200 test files). Summary of what I changed and what to run next:',
        '',
        'What I changed',
        '',
        '- Replaced Jest as the test runner for packages/explorer-view.',
        '- Updated package.json test scripts and devDependencies.',
        '- Added a Vitest config file to the package.',
        "- Added a small shim so existing imports of '@jest/globals' continue to work without changing all test files.",
        '- The shim re-exports expect, test, describe, beforeEach, afterEach, it, and vi, and provides a jest alias for tests that still use jest.fn.',
      ].join('\n'),
      time: '10:14 AM',
      toolCalls,
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(3)
  await expect(messages.nth(0)).toHaveText('lets migrate from jest to vitest please')

  const toolCallMessage = messages.nth(1)
  const orderedToolCalls = toolCallMessage.locator('.ChatOrderedListItem')
  await expect(orderedToolCalls).toHaveCount(27)

  for (const [index, expectedLabel] of expectedToolCallLabels.entries()) {
    await expect(orderedToolCalls.nth(index)).toContainText(expectedLabel)
  }

  await expect(toolCallMessage).toContainText('tools')

  const assistantReply = messages.nth(2)
  await expect(assistantReply).toContainText('I started the migration from Jest to Vitest for the explorer-view package')
  await expect(assistantReply).toContainText('left the test suite itself untouched')
  await expect(assistantReply).toContainText('Updated package.json test scripts and devDependencies.')
  await expect(assistantReply).toContainText('Added a Vitest config file to the package.')
  await expect(assistantReply).toContainText("Added a small shim so existing imports of '@jest/globals' continue to work")
  await expect(assistantReply).toContainText('provides a jest alias for tests that still use jest.fn')
}
