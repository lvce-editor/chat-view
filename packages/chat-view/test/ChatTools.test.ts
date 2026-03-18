/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { expect, test } from '@jest/globals'
import { ChatToolWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { executeChatTool, getBasicChatTools } from '../src/parts/ChatTools/ChatTools.ts'

const options = {
  assetDir: '/test-asset-dir',
  platform: 0,
}

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

test('getBasicChatTools should include ask_question tool when enabled', () => {
  const tools = getBasicChatTools(true)
  const names = tools.map((tool) => tool.function.name)
  expect(names).toEqual(['read_file', 'write_file', 'list_files', 'getWorkspaceUri', 'render_html', 'ask_question'])
})

test('executeChatTool should execute read_file tool', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': async () => 'hello world',
  })

  const uri = 'file:///workspace/src/main.ts'
  const result = await executeChatTool('read_file', JSON.stringify({ uri }), options)

  expect(mockRendererRpc.invocations).toEqual([['FileSystem.readFile', uri]])
  expect(JSON.parse(result)).toEqual({
    content: 'hello world',
    uri,
  })
})

test('executeChatTool should execute write_file tool', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'FileSystem.writeFile': async () => undefined,
  })

  const result = await executeChatTool('write_file', JSON.stringify({ content: 'new content', path: 'src/main.ts' }), options)

  expect(mockRendererRpc.invocations).toEqual([['FileSystem.writeFile', 'src/main.ts', 'new content']])
  expect(JSON.parse(result)).toEqual({
    ok: true,
    path: 'src/main.ts',
  })
})

test('executeChatTool should execute list_files tool', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes': async () => [
      [1, 'src'],
      [2, 'README.md'],
    ],
  })

  const uri = 'file:///workspace'
  const result = await executeChatTool('list_files', JSON.stringify({ uri }), options)

  expect(mockRendererRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', uri]])
  expect(JSON.parse(result)).toEqual({
    entries: [
      [1, 'src'],
      [2, 'README.md'],
    ],
    uri,
  })
})

test('executeChatTool should execute getWorkspaceUri tool', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Workspace.getPath': async () => '/workspace/project',
  })

  const result = await executeChatTool('getWorkspaceUri', JSON.stringify({}), options)

  expect(mockRendererRpc.invocations).toEqual([['Workspace.getPath']])
  expect(JSON.parse(result)).toEqual({
    workspaceUri: '/workspace/project',
  })
})

test('executeChatTool should execute render_html tool', async () => {
  const result = await executeChatTool(
    'render_html',
    JSON.stringify({
      css: '.card { color: blue; }',
      html: '<div class="card">weather</div>',
      title: 'Weather Card',
    }),
    options,
  )

  expect(JSON.parse(result)).toEqual({
    css: '.card { color: blue; }',
    html: '<div class="card">weather</div>',
    ok: true,
    title: 'Weather Card',
  })
})

test('executeChatTool should execute ask_question tool', async () => {
  const result = await executeChatTool('ask_question', JSON.stringify({ answers: ['A', 'B'], question: 'Pick one?' }), options)

  expect(JSON.parse(result)).toEqual({
    answers: ['A', 'B'],
    ok: true,
    question: 'Pick one?',
  })
})

test('executeChatTool should reject path traversal attempts', async () => {
  const result = await executeChatTool('read_file', JSON.stringify({ path: '../secret.txt' }), options)

  expect(JSON.parse(result)).toEqual({
    error: 'Access denied: path must be relative and stay within the open workspace folder.',
  })
})

test('executeChatTool should return unknown tool error', async () => {
  const result = await executeChatTool('unknown_tool', '{}', options)

  expect(JSON.parse(result)).toEqual({
    error: 'Unknown tool: unknown_tool',
  })
})

test('executeChatTool should delegate to chat tool worker when enabled', async () => {
  using mockRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.execute': async () => '{"ok":true}',
  })
  const result = await executeChatTool('read_file', JSON.stringify({ path: 'a.txt' }), { ...options, useChatToolWorker: true })
  expect(result).toBe('{"ok":true}')
  expect(mockRpc.invocations).toEqual([['ChatTool.execute', 'read_file', '{"path":"a.txt"}', { assetDir: '/test-asset-dir', platform: 0 }]])
})

test('executeChatTool should include error stack when tool execution throws', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': async () => {
      const error = new TypeError("Cannot read properties of undefined (reading 'invoke')")
      error.stack = "TypeError: Cannot read properties of undefined (reading 'invoke')\n    at test:1:1"
      throw error
    },
  })

  const uri = 'file:///workspace/src/main.ts'
  const result = await executeChatTool('read_file', JSON.stringify({ uri }), options)

  expect(mockRendererRpc.invocations).toEqual([['FileSystem.readFile', uri]])
  expect(JSON.parse(result)).toEqual({
    error: "TypeError: Cannot read properties of undefined (reading 'invoke')",
    errorStack: "TypeError: Cannot read properties of undefined (reading 'invoke')\n    at test:1:1",
    stack: "TypeError: Cannot read properties of undefined (reading 'invoke')\n    at test:1:1",
    uri,
  })
})
