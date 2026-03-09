/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { expect, test } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import { executeChatTool, getBasicChatTools } from '../src/parts/ChatTools/ChatTools.ts'
import { FileSystemWriteFile } from '../src/parts/ExtensionHostCommandType/ExtensionHostCommandType.ts'

const options = {
  assetDir: '/test-asset-dir',
  platform: 0,
}

test('getBasicChatTools should return read, write and list tool definitions', () => {
  const tools = getBasicChatTools()

  const names = tools.map((tool) => tool.function.name)

  expect(names).toEqual(['read_file', 'write_file', 'list_files'])
})

test('executeChatTool should execute read_file tool', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': async () => 'hello world',
  })

  const result = await executeChatTool('read_file', JSON.stringify({ path: './src/main.ts' }), options)

  expect(mockRendererRpc.invocations).toEqual([['FileSystem.readFile', 'src/main.ts']])
  expect(JSON.parse(result)).toEqual({
    content: 'hello world',
    path: 'src/main.ts',
  })
})

test('executeChatTool should execute write_file tool', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })
  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [FileSystemWriteFile]: async () => undefined,
  })

  const result = await executeChatTool('write_file', JSON.stringify({ content: 'new content', path: 'src/main.ts' }), options)

  expect(mockRendererRpc.invocations).toEqual([['ExtensionHostManagement.activateByEvent', 'onFileSystem', '/test-asset-dir', 0]])
  expect(mockExtensionHostRpc.invocations).toEqual([[FileSystemWriteFile, 'file', 'src/main.ts', 'new content']])
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

  const result = await executeChatTool('list_files', JSON.stringify({ path: '.' }), options)

  expect(mockRendererRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '.']])
  expect(JSON.parse(result)).toEqual({
    entries: [
      [1, 'src'],
      [2, 'README.md'],
    ],
    path: '.',
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
