import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleMessagesContextMenu from '../src/parts/HandleMessagesContextMenu/HandleMessagesContextMenu.ts'

test('handleMessagesContextMenu should invoke ContextMenu.show with menu id', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show': async () => {},
  })

  const state = createDefaultState()
  const result = await HandleMessagesContextMenu.handleMessagesContextMenu(state)

  expect(mockRpc.invocations).toEqual([['ContextMenu.show', 1234]])
  expect(result).toBe(state)
})
