import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { IconThemeWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const sendMessagePortToIconThemeWorker = async (port: MessagePort): Promise<void> => {
  await RendererWorker.sendMessagePortToIconThemeWorker(port, 0)
}

export const initializeIconThemeWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToIconThemeWorker,
  })
  IconThemeWorker.set(rpc)
}
