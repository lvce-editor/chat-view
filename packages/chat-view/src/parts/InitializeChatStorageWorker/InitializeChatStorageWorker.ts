import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { ChatStorageWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const sendMessagePortToChatStorageWorker = async (port: MessagePort): Promise<void> => {
  await RendererWorker.sendMessagePortToChatStorageWorker(port)
}

export const initializeChatStorageWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToChatStorageWorker,
  })
  ChatStorageWorker.set(rpc)
}
