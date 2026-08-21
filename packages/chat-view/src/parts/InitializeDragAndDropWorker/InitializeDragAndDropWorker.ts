import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { DragAndDropWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const sendMessagePortToDragAndDropWorker = async (port: MessagePort): Promise<void> => {
  await RendererWorker.sendMessagePortToDragAndDropWorker(port)
}

export const initializeDragAndDropWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToDragAndDropWorker,
  })
  DragAndDropWorker.set(rpc)
}
