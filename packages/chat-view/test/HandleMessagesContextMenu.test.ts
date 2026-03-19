import { expect, test } from '@jest/globals'
import { MenuEntryId } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleMessagesContextMenu from '../src/parts/HandleMessagesContextMenu/HandleMessagesContextMenu.ts'

test('handleMessagesContextMenu should invoke ContextMenu.show2 with chat menu id', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {},
  })

  const state = {
    ...createDefaultState(),
    uid: 7,
  }
  const result = await HandleMessagesContextMenu.handleMessagesContextMenu(state, 0, 100, 200)

  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 7, MenuEntryId.Chat, 100, 200, { menuId: MenuEntryId.Chat }]])
  expect(result).toBe(state)
})
