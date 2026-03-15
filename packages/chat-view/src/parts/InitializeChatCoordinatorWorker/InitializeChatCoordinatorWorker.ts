import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ChatCoordinatorWorker from '../ChatCoordinatorWorker/ChatCoordinatorWorker.ts'

const sendMessagePortToChatCoordinatorWorker = async (port: MessagePort): Promise<void> => {
  const command = 'HandleMessagePort.handleMessagePort'
  await RendererWorker.invokeAndTransfer('SendMessagePortToExtensionHostWorker.sendMessagePortToChatCoordinatorWorker', port, command)
}

export const initializeChatCoordinatorWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToChatCoordinatorWorker,
  })
  ChatCoordinatorWorker.set(rpc)
}
