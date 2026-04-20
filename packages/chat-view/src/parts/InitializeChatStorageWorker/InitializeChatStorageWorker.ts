import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { ChatStorageWorker, RendererWorker, RpcId } from '@lvce-editor/rpc-registry'

const sendMessagePortToChatStorageWorker = async (port: MessagePort): Promise<void> => {
  await RendererWorker.invokeAndTransfer(
    'SendMessagePortToExtensionHostWorker.sendMessagePortToChatStorageWorker',
    port,
    'HandleMessagePort.handleMessagePort',
    6020,
  )
}

export const initializeChatStorageWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToChatStorageWorker,
  })
  ChatStorageWorker.set(rpc)
}
