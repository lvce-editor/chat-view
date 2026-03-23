import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { ChatCoordinatorWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const sendMessagePortToChatCoordinatorWorker = async (port: MessagePort): Promise<void> => {
  await RendererWorker.sendMessagePortToChatCoordinatorWorkerWorker(port, 0)
}

export const initializeChatCoordinatorWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToChatCoordinatorWorker,
  })
  ChatCoordinatorWorker.set(rpc)
}
