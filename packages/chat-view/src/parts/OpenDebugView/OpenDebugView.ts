import { RendererWorker } from '@lvce-editor/rpc-registry'

export const openDebugView = async (state: any): Promise<any> => {
  const { selectedSessionId } = state
  if (!selectedSessionId) {
    return state
  }

  await RendererWorker.invoke(`Main.openUri`, `chat-debug://${selectedSessionId}`)

  return state
}
