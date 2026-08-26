import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { ChatStorageWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { rpcIdViewModel } from '../ChatSessionStorage/ChatSessionStorage.ts'

const sendMessagePortToChatStorageWorker = async (port: MessagePort): Promise<void> => {
  // @ts-ignore
  await RendererWorker.sendMessagePortToChatStorageWorker(port, rpcIdViewModel)
}

export const initializeChatStorageWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToChatStorageWorker,
  })
  ChatStorageWorker.set(rpc)
}
