import { expect, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererProcess } from '@lvce-editor/rpc-registry'
import { sendMessagePortToDragAndDropWorker } from '../src/parts/InitializeDragAndDropWorker/InitializeDragAndDropWorker.ts'

test('transfers the direct rpc port through the renderer process', async () => {
  const rendererProcessRpc = createMockRpc({
    commandMap: {
      'DragAndDrop.handleMessagePort'() {},
    },
  })
  RendererProcess.set(rendererProcessRpc)
  const port = {} as MessagePort

  await sendMessagePortToDragAndDropWorker(port)

  expect(rendererProcessRpc.invocations).toEqual([['DragAndDrop.handleMessagePort', port]])
})
