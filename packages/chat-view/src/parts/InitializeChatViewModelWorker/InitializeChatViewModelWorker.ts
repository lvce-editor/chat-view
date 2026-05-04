import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { ChatViewModelWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const sendMessagePortToChatViewModel = async (port: MessagePort): Promise<void> => {
  await RendererWorker.sendMessagePortToChatViewModel(port)
}

export const initializeChatViewModelWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToChatViewModel,
  })
  ChatViewModelWorker.set(rpc)
}
