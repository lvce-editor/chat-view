import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { ClipBoardWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const sendMessagePortToClipBoardWorker = async (port: MessagePort): Promise<void> => {
  await RendererWorker.sendMessagePortToClipBoardWorker(port, 0)
}

export const initializeClipBoardWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToClipBoardWorker,
  })
  ClipBoardWorker.set(rpc)
}
