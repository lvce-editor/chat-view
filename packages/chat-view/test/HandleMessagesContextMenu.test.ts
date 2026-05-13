import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { MenuChatInput } from '../src/parts/GetMenuEntryIds/GetMenuEntryIds.ts'
import * as HandleMessagesContextMenu from '../src/parts/HandleMessagesContextMenu/HandleMessagesContextMenu.ts'

test('handleMessagesContextMenu should invoke ContextMenu.show2 with chat input menu id', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {},
  })

  const state = {
    ...createDefaultState(),
    uid: 7,
  }
  const result = await HandleMessagesContextMenu.handleMessagesContextMenu(state, 0, 100, 200)

  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 7, MenuChatInput, 100, 200, { menuId: MenuChatInput }]])
  expect(result).toBe(state)
})
