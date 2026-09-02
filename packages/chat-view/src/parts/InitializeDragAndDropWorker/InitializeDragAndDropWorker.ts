import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const sendMessagePortToDragAndDropWorker = async (port: MessagePort): Promise<void> => {
  await RendererProcess.invokeAndTransfer('DragAndDrop.handleMessagePort', port)
}

export const initializeDragAndDropWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToDragAndDropWorker,
  })
  DragAndDropWorker.set(rpc)
}
