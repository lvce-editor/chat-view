/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
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
