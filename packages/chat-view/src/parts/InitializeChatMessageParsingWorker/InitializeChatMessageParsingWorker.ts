import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { ChatToolWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const send = (port: MessagePort): Promise<void> => {
  // @ts-ignore
  return RendererWorker.sendMessagePortToChatMessageParsingWorker(port)
}

export const initializeChatMessageParsingWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send,
  })
  ChatToolWorker.set(rpc)
}
