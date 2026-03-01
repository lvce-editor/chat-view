import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleChatListContextMenu from '../src/parts/HandleChatListContextMenu/HandleChatListContextMenu.ts'

test('handleChatListContextMenu should invoke ContextMenu.show for session items', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show': async () => {},
  })

  globalThis.name = 'session:session-1'
  await HandleChatListContextMenu.handleChatListContextMenu(createDefaultState(), 100, 200)

  expect(mockRpc.invocations).toEqual([['ContextMenu.show', 100, 200, 'ChatListItemContextMenu', 'session-1']])
})

test('handleChatListContextMenu should ignore non-session names', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show': async () => {},
  })

  globalThis.name = 'send'
  await HandleChatListContextMenu.handleChatListContextMenu(createDefaultState(), 100, 200)

  expect(mockRpc.invocations).toEqual([])
})
