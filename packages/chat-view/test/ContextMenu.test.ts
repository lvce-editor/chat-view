import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererProcess as RendererProcessRegistry } from '@lvce-editor/rpc-registry'
import * as ContextMenu from '../src/parts/ContextMenu/ContextMenu.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

test('defers renderer worker forwarding for a direct connection', async () => {
  const { promise: forwarded, resolve } = Promise.withResolvers<void>()
  const forwardRendererWorkerCommand = jest.fn((_method: string, ..._params: readonly unknown[]) => {
    resolve()
  })
  RendererProcess.set(
    Object.assign(
      createMockRpc({
        commandMap: {
          'Viewlet.forwardRendererWorkerCommand': forwardRendererWorkerCommand,
        },
      }),
      { dispose: jest.fn() },
    ),
  )

  await ContextMenu.show2(7, 2180, 20, 30, { menuId: 2180 })

  await forwarded
  expect(forwardRendererWorkerCommand).toHaveBeenCalledWith('ContextMenu.show2', 7, 2180, 20, 30, { menuId: 2180 })
  await RendererProcessRegistry.dispose()
})
