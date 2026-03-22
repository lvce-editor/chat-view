import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { MenuProjectAddButton } from '../src/parts/GetMenuEntryIds/GetMenuEntryIds.ts'
import * as HandleProjectAddButtonContextMenu from '../src/parts/HandleProjectAddButtonContextMenu/HandleProjectAddButtonContextMenu.ts'

test('handleProjectAddButtonContextMenu should invoke ContextMenu.show2 with add project menu id', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {},
  })

  const state = {
    ...createDefaultState(),
    uid: 7,
  }
  const result = await HandleProjectAddButtonContextMenu.handleProjectAddButtonContextMenu(state, 0, 100, 200)

  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 7, MenuProjectAddButton, 100, 200, { menuId: MenuProjectAddButton }]])
  expect(result).toBe(state)
})
