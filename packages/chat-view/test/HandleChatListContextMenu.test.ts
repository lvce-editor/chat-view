import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleChatListContextMenu from '../src/parts/HandleChatListContextMenu/HandleChatListContextMenu.ts'

test('handleChatListContextMenu should invoke ContextMenu.show for session items', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show': async () => {},
  })

  await HandleChatListContextMenu.handleChatListContextMenu('session:session-1', 100, 200)

  expect(mockRpc.invocations).toEqual([['ContextMenu.show', 100, 200, 'ChatListItemContextMenu', 'session-1']])
})

test('handleChatListContextMenu should ignore non-session names', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show': async () => {},
  })

  await HandleChatListContextMenu.handleChatListContextMenu('send', 100, 200)

  expect(mockRpc.invocations).toEqual([])
})
