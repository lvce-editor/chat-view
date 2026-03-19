import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { OpenerWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const sendMessagePortToChatStorageWorker = async (port: MessagePort): Promise<void> => {
  // @ts-ignore
  await RendererWorker.sendMessagePortToChatStorageWorker(port, 0)
}

export const initializeChatStorageWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToChatStorageWorker,
  })
  OpenerWorker.set(rpc)
}
