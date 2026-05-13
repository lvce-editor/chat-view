import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { ChatToolWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const send = (port: MessagePort): Promise<void> => {
  return RendererWorker.sendMessagePortToChatToolWorker(port)
}

export const initializeChatToolWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send,
  })
  ChatToolWorker.set(rpc)
}
