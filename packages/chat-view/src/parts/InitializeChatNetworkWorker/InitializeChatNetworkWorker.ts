import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { ChatNetworkWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const send = (port: MessagePort): Promise<void> => {
  return RendererWorker.sendMessagePortToChatNetworkWorker(port)
}

export const initializeChatNetworkWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send,
  })
  ChatNetworkWorker.set(rpc)
}
