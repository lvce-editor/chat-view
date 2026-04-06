/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-multiple-tool-failures-error-rendering'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Chat.openMockSession('session-tool-failures', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'please create a small tetris game in the current workspace',
      time: '08:12 PM',
    },
    {
      id: 'message-assistant-1',
      inProgress: false,
      role: 'assistant',
      text: 'OpenAI request failed.',
      time: '08:12 PM',
      toolCalls: [
        {
          arguments: '{}',
          id: 'call_01',
          name: 'getWorkspaceUri',
          status: 'success',
        },
        {
          arguments: '{"path":"html:///html-playground-2/tetris"}',
          errorMessage: 'TypeError: fileSystem.mkdir is not a function',
          id: 'call_02',
          name: 'create_directory',
          status: 'error',
        },
        {
          arguments: '{"path":"file:///tetris"}',
          errorMessage: "TypeError: Cannot read properties of undefined (reading 'invoke')",
          id: 'call_03',
          name: 'create_directory',
          status: 'error',
        },
        {
          arguments:
            '{"path":"index.html","content":"<!doctype html><html><head><title>Tetris Game</title></head><body><h1>Tetris</h1></body></html>"}',
          errorMessage: 'Failed to save file: DOMException: A requested file or directory could not be found at the time an operation was processed.',
          id: 'call_04',
          name: 'write_file',
          status: 'error',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('please create a small tetris game in the current workspace')
  await expect(messages.nth(1)).toContainText('OpenAI request failed.')

  await expect(messages.nth(1)).toContainText('get_workspace_uri')
  await expect(messages.nth(1)).toContainText('create_directory tetris')
  await expect(messages.nth(1)).toContainText('(error: TypeError: fileSystem.mkdir is not a function)')
  await expect(messages.nth(1)).toContainText('create_directory tetris')
  await expect(messages.nth(1)).toContainText("(error: TypeError: Cannot read properties of undefined (reading 'invoke'))")
  const toolCalls = messages.nth(1).locator('.ChatOrderedListItem')
  await expect(toolCalls).toHaveCount(4)
  await expect(toolCalls.nth(1)).toHaveAttribute('title', 'html:///html-playground-2/tetris')
  await expect(toolCalls.nth(2)).toHaveAttribute('title', 'file:///tetris')
  await expect(messages.nth(1)).toContainText('write_file index.html')
  await expect(messages.nth(1)).toContainText(
    '(error: Failed to save file: DOMException: A requested file or directory could not be found at the time an operation was processed.)',
  )
  await expect(messages.nth(1)).not.toContainText('+0')
  await expect(messages.nth(1)).not.toContainText('-0')
}
