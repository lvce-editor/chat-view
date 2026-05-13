import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { ChatMessageParsingWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const send = (port: MessagePort): Promise<void> => {
  return RendererWorker.sendMessagePortToChatMessageParsingWorker(port, 0)
}

export const initializeChatMessageParsingWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send,
  })
  ChatMessageParsingWorker.set(rpc)
}
