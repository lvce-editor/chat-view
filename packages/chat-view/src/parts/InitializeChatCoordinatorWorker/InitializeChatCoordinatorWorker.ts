import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { ChatMathWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const sendMessagePortToChatCoordinatorWorker = async (port: MessagePort): Promise<void> => {
  // TODO:
  await RendererWorker.sendMessagePortToChatMathWorker(port, 0)
}

export const initializeChatCoordinatorWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToChatCoordinatorWorker,
  })
  ChatMathWorker.set(rpc)
}
