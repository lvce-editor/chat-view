import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererProcess as RendererProcessRegistry } from '@lvce-editor/rpc-registry'
import * as ContextMenu from '../src/parts/ContextMenu/ContextMenu.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

test('forwards context menus through a connected renderer process', async () => {
  const forwardRendererWorkerCommand = jest.fn(async (..._args: readonly unknown[]) => {})
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

  expect(forwardRendererWorkerCommand).toHaveBeenCalledWith('ContextMenu.show2', 7, 2180, 20, 30, { menuId: 2180 })
  await RendererProcessRegistry.dispose()
})
