import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleChatListContextMenu from '../src/parts/HandleChatListContextMenu/HandleChatListContextMenu.ts'

test('handleChatListContextMenu should invoke ContextMenu.show for session items', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show': async () => {},
  })

  const state = {
    ...createDefaultState(),
    height: 400,
    width: 300,
  }
  await HandleChatListContextMenu.handleChatListContextMenu(state, 100, 60)

  expect(mockRpc.invocations).toEqual([['ContextMenu.show', 100, 60, 'ChatListItemContextMenu', 'session-1']])
})

test('handleChatListContextMenu should ignore clicks outside list bounds', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show': async () => {},
  })

  const state = {
    ...createDefaultState(),
    height: 400,
    width: 300,
  }
  await HandleChatListContextMenu.handleChatListContextMenu(state, 100, 500)

  expect(mockRpc.invocations).toEqual([])
})
