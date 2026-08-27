import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererProcess as RendererProcessRegistry, RendererWorker } from '@lvce-editor/rpc-registry'
import * as ContextMenu from '../src/parts/ContextMenu/ContextMenu.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

test('defers the renderer worker command for a direct connection', async () => {
  const { promise: shown, resolve } = Promise.withResolvers<void>()
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {
      resolve()
    },
  })
  RendererProcess.set(Object.assign(createMockRpc({ commandMap: {} }), { dispose: jest.fn() }))

  await ContextMenu.show2(7, 2180, 20, 30, { menuId: 2180 })

  await shown
  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 7, 2180, 20, 30, { menuId: 2180 }]])
  await RendererProcessRegistry.dispose()
})
