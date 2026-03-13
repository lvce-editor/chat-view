import { LazyTransferMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import { ChatMathWorker, RendererWorker } from '@lvce-editor/rpc-registry'

let initialized = false

const sendMessagePortToChatMathWorker = async (port: MessagePort): Promise<void> => {
  try {
    await RendererWorker.invoke('sendMessagePortToChatMathWorker', port)
  } catch {
    await RendererWorker.invoke('SendMessagePortToChatMathWorker.sendMessagePortToChatMathWorker', port)
  }
}

const createRpc = (): Promise<Rpc> => {
  return LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToChatMathWorker,
  })
}

export const initialize = async (): Promise<void> => {
  if (initialized) {
    return
  }
  const rpc = await createRpc()
  ChatMathWorker.set(rpc)
  initialized = true
}

export const invoke = async <T>(method: string, ...params: readonly unknown[]): Promise<T> => {
  await initialize()
  return ChatMathWorker.invoke(method, ...params) as T
}
