import { expect, test } from '@jest/globals'
import { ChatToolWorker } from '@lvce-editor/rpc-registry'
import { getBasicChatTools } from '../src/parts/ChatTools/ChatTools.ts'

test('getBasicChatTools should load tools from chat tool worker', async () => {
  using mockRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.getTools': async () => [
      {
        function: {
          description: 'Read file',
          name: 'read_file',
          parameters: {
            additionalProperties: false,
            properties: {
              uri: {
                type: 'string',
              },
            },
            required: ['uri'],
            type: 'object',
          },
        },
        type: 'function',
      },
    ],
  })
  const tools = await getBasicChatTools()

  const names = tools.map((tool) => tool.function.name)

  expect(names).toEqual(['read_file'])
  expect(mockRpc.invocations).toEqual([['ChatTool.getTools']])
})

test('getBasicChatTools should restrict plan mode to read-only workspace tools', async () => {
  using mockRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.getTools': async () => [
      {
        function: {
          description: 'Read file',
          name: 'read_file',
          parameters: {
            additionalProperties: false,
            properties: {},
            type: 'object',
          },
        },
        type: 'function',
      },
      {
        function: {
          description: 'List files',
          name: 'list_files',
          parameters: {
            additionalProperties: false,
            properties: {},
            type: 'object',
          },
        },
        type: 'function',
      },
      {
        function: {
          description: 'Write file',
          name: 'write_file',
          parameters: {
            additionalProperties: false,
            properties: {},
            type: 'object',
          },
        },
        type: 'function',
      },
      {
        function: {
          description: 'Ask user',
          name: 'ask_question',
          parameters: {
            additionalProperties: false,
            properties: {},
            type: 'object',
          },
        },
        type: 'function',
      },
      {
        function: {
          description: 'Get workspace',
          name: 'get_workspace_uri',
          parameters: {
            additionalProperties: false,
            properties: {},
            type: 'object',
          },
        },
        type: 'function',
      },
    ],
  })

  const tools = await getBasicChatTools('plan', true)

  const names = tools.map((tool) => tool.function.name)

  expect(names).toEqual(['read_file', 'list_files', 'get_workspace_uri'])
  expect(mockRpc.invocations).toEqual([['ChatTool.getTools']])
})
