import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-create-directory-invalid-parameters'

const assert = (condition: unknown, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const skip = 1

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const folderName = 'relative-folder'
  const invalidUri = folderName

  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiStreamReset()

  const sseResponseParts = [
    {
      eventId: 1,
      sessionId: '01',
      timestamp: new Date().toISOString(),
      type: 'sse-response-completed',
      value: {
        response: {
          background: false,
          completed_at: 1,
          created_at: 1,
          error: null,
          id: 'resp_01',
          model: 'gpt-4.1-mini-2025-04-14',
          object: 'response',
          output: [
            {
              arguments: JSON.stringify({ uri: invalidUri }),
              call_id: 'call_01',
              id: 'fc_01',
              name: 'create_directory',
              status: 'completed',
              type: 'function_call',
            },
          ],
          status: 'completed',
          tool_choice: 'auto',
          tools: [],
        },
        sequence_number: 1,
        type: 'response.completed',
      },
    },
  ]

  for (const responsePart of sseResponseParts) {
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  await Chat.mockOpenApiStreamFinish()

  await Chat.handleInput(`Create the ${folderName} directory in the workspace`)
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const message0 = messages.nth(0)
  await expect(message0).toHaveText(`Create the ${folderName} directory in the workspace`)
  const message1 = messages.nth(1)
  await expect(message1).toContainText(`create_directory ${folderName}`)
  await expect(message1).toContainText('(error: Invalid argument: uri must be an absolute URI.)')

  const toolCalls = message1.locator('.ChatOrderedListItem')
  await expect(toolCalls).toHaveCount(1)

  const entries = await FileSystem.readDir(tmpDir)
  const folderEntry = entries.find((entry) => entry.name === folderName)
  assert(!folderEntry, `Expected ${folderName} to not be created in ${tmpDir}`)
}
