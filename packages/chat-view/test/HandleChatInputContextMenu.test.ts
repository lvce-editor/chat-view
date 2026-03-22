import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleChatInputContextMenu from '../src/parts/HandleChatInputContextMenu/HandleChatInputContextMenu.ts'

test('handleChatInputContextMenu should return state unchanged', async () => {
  const state = createDefaultState()
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {},
  })
  const result = await HandleChatInputContextMenu.handleChatInputContextMenu(state, 0, 0)
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([
    [
      'ContextMenu.show2',
      0,
      2180,
      0,
      0,
      {
        menuId: 2180,
      },
    ],
  ])
})
