import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererProcess as RendererProcessRegistry, RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleClickClose from '../src/parts/HandleClickClose/HandleClickClose.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

test('handleClickClose should invoke Layout.hideSecondarySideBar', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.hideSecondarySideBar': async () => {},
  })

  await HandleClickClose.handleClickClose()

  expect(mockRpc.invocations).toEqual([['Layout.hideSecondarySideBar']])
})

test('handleClickClose forwards through a connected renderer process', async () => {
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

  await HandleClickClose.handleClickClose()

  expect(forwardRendererWorkerCommand).toHaveBeenCalledWith('Layout.hideSecondarySideBar')
  await RendererProcessRegistry.dispose()
})
