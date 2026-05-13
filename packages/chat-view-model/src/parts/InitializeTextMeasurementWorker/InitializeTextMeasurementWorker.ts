import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker, TextMeasurementWorker } from '@lvce-editor/rpc-registry'

const sendMessagePortToTextMeasurementWorker = async (port: MessagePort): Promise<void> => {
  await RendererWorker.sendMessagePortToTextMeasurementWorker(port)
}

export const initializeTextMeasurementWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToTextMeasurementWorker,
  })
  TextMeasurementWorker.set(rpc)
}
