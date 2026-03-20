import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { OpenerWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const sendMessagePortToClipBoardWorker = async (port: MessagePort): Promise<void> => {
  await RendererWorker.sendMessagePortToClipBoardWorker(port, 0)
}

export const initializeClipBoardWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToClipBoardWorker,
  })
  OpenerWorker.set(rpc)
}
