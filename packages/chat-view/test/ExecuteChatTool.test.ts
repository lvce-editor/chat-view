import { expect, test } from '@jest/globals'
import { ChatToolWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { executeChatTool } from '../src/parts/ExecuteChatTool/ExecuteChatTool.ts'

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
