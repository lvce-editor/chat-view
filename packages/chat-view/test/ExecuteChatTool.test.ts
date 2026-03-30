import { expect, test } from '@jest/globals'
import { ChatToolWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { getChatViewEvents } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { executeChatTool } from '../src/parts/ExecuteChatTool/ExecuteChatTool.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

const executeToolOptions = {
  assetDir: '',
  platform: 0,
  useChatToolWorker: true,
} as const

test('executeChatTool should preserve write_file line counts from the worker', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  using mockChatToolRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.execute': async () => ({
      linesAdded: 2,
      linesDeleted: 1,
      ok: true,
    }),
  })

  const result = await executeChatTool('write_file', JSON.stringify({ content: 'alpha\nbeta', path: 'notes.txt' }), executeToolOptions)

  expect(JSON.parse(result)).toEqual({
    linesAdded: 2,
    linesDeleted: 1,
    ok: true,
  })
  expect(mockRendererRpc.invocations).toEqual([])
  expect(mockChatToolRpc.invocations).toEqual([
    ['ChatTool.execute', 'write_file', '{"content":"alpha\\nbeta","path":"notes.txt"}', { assetDir: '', platform: 0 }],
  ])
})

test('executeChatTool should synthesize write_file line counts when the worker omits them', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': async () => 'alpha\nbeta',
  })
  using mockChatToolRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.execute': async () => ({
      ok: true,
      path: 'notes.txt',
    }),
  })

  const result = await executeChatTool('write_file', JSON.stringify({ content: 'alpha\nbeta\ngamma', path: 'notes.txt' }), executeToolOptions)

  expect(JSON.parse(result)).toEqual({
    linesAdded: 1,
    linesDeleted: 0,
    ok: true,
    path: 'notes.txt',
  })
  expect(mockRendererRpc.invocations).toEqual([['FileSystem.readFile', 'notes.txt']])
  expect(mockChatToolRpc.invocations).toEqual([
    ['ChatTool.execute', 'write_file', '{"content":"alpha\\nbeta\\ngamma","path":"notes.txt"}', { assetDir: '', platform: 0 }],
  ])
})

test('executeChatTool should treat a missing pre-write file as an empty file', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': async () => {
      throw new Error('File not found: notes.txt')
    },
  })
  using mockChatToolRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.execute': async () => ({
      ok: true,
      path: 'notes.txt',
    }),
  })

  const result = await executeChatTool('write_file', JSON.stringify({ content: 'alpha\nbeta\ngamma', path: 'notes.txt' }), executeToolOptions)

  expect(JSON.parse(result)).toEqual({
    linesAdded: 3,
    linesDeleted: 0,
    ok: true,
    path: 'notes.txt',
  })
  expect(mockRendererRpc.invocations).toEqual([['FileSystem.readFile', 'notes.txt']])
  expect(mockChatToolRpc.invocations).toEqual([
    ['ChatTool.execute', 'write_file', '{"content":"alpha\\nbeta\\ngamma","path":"notes.txt"}', { assetDir: '', platform: 0 }],
  ])
})

test('executeChatTool should reject disabled tools before invoking the worker', async () => {
  using mockChatToolRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.execute': async () => ({
      ok: true,
    }),
  })

  await expect(
    executeChatTool('read_file', JSON.stringify({ path: 'README.md' }), {
      ...executeToolOptions,
      toolEnablement: {
        read_file: false,
      },
    }),
  ).rejects.toThrow('Tool "read_file" is disabled in chat.toolEnablement preferences.')

  expect(mockChatToolRpc.invocations).toEqual([])
})

test('executeChatTool should store tool execution start and finish events for successful calls', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  using mockChatToolRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.execute': async () => ({
      ok: true,
      uri: 'file:///workspace',
    }),
  })

  const result = await executeChatTool('getWorkspaceUri', JSON.stringify({}), {
    ...executeToolOptions,
    sessionId: 'session-1',
    toolCallId: 'tool-1',
  })

  expect(JSON.parse(result)).toEqual({
    ok: true,
    uri: 'file:///workspace',
  })
  expect(mockChatToolRpc.invocations).toEqual([['ChatTool.execute', 'getWorkspaceUri', '{}', { assetDir: '', platform: 0 }]])
  await expect(getChatViewEvents('session-1')).resolves.toEqual([
    {
      arguments: '{}',
      id: 'tool-1',
      name: 'getWorkspaceUri',
      options: {
        assetDir: '',
        platform: 0,
      },
      sessionId: 'session-1',
      time: expect.any(String),
      timestamp: expect.any(String),
      type: 'tool-execution-started',
    },
    {
      id: 'tool-1',
      name: 'getWorkspaceUri',
      result: '{"ok":true,"uri":"file:///workspace"}',
      sessionId: 'session-1',
      status: 'success',
      timestamp: expect.any(String),
      type: 'tool-execution-finished',
    },
  ])
  expect(mockChatStorageRpc.invocations).toEqual([
    [
      'ChatStorage.appendEvent',
      {
        arguments: '{}',
        id: 'tool-1',
        name: 'getWorkspaceUri',
        options: {
          assetDir: '',
          platform: 0,
        },
        sessionId: 'session-1',
        time: expect.any(String),
        timestamp: expect.any(String),
        type: 'tool-execution-started',
      },
    ],
    [
      'ChatStorage.appendEvent',
      {
        id: 'tool-1',
        name: 'getWorkspaceUri',
        result: '{"ok":true,"uri":"file:///workspace"}',
        sessionId: 'session-1',
        status: 'success',
        timestamp: expect.any(String),
        type: 'tool-execution-finished',
      },
    ],
    ['ChatStorage.getEvents', 'session-1'],
  ])
})

test('executeChatTool should store failed tool execution events when the worker throws', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  using mockChatToolRpc = ChatToolWorker.registerMockRpc({
    'ChatTool.execute': async () => {
      throw new Error('tool crashed')
    },
  })

  await expect(
    executeChatTool('read_file', JSON.stringify({ path: 'README.md' }), {
      ...executeToolOptions,
      sessionId: 'session-2',
      toolCallId: 'tool-2',
    }),
  ).rejects.toThrow('tool crashed')

  expect(mockChatToolRpc.invocations).toEqual([['ChatTool.execute', 'read_file', '{"path":"README.md"}', { assetDir: '', platform: 0 }]])
  await expect(getChatViewEvents('session-2')).resolves.toEqual([
    {
      arguments: '{"path":"README.md"}',
      id: 'tool-2',
      name: 'read_file',
      options: {
        assetDir: '',
        platform: 0,
      },
      sessionId: 'session-2',
      time: expect.any(String),
      timestamp: expect.any(String),
      type: 'tool-execution-started',
    },
    {
      id: 'tool-2',
      name: 'read_file',
      result: '{"error":"tool crashed"}',
      sessionId: 'session-2',
      status: 'error',
      timestamp: expect.any(String),
      type: 'tool-execution-finished',
    },
  ])
  expect(mockChatStorageRpc.invocations).toEqual([
    [
      'ChatStorage.appendEvent',
      {
        arguments: '{"path":"README.md"}',
        id: 'tool-2',
        name: 'read_file',
        options: {
          assetDir: '',
          platform: 0,
        },
        sessionId: 'session-2',
        time: expect.any(String),
        timestamp: expect.any(String),
        type: 'tool-execution-started',
      },
    ],
    [
      'ChatStorage.appendEvent',
      {
        id: 'tool-2',
        name: 'read_file',
        result: '{"error":"tool crashed"}',
        sessionId: 'session-2',
        status: 'error',
        timestamp: expect.any(String),
        type: 'tool-execution-finished',
      },
    ],
    ['ChatStorage.getEvents', 'session-2'],
  ])
})
