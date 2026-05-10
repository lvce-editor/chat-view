import { RendererWorker } from '@lvce-editor/rpc-registry'

export const openDebugView = async (state: any): Promise<any> => {
  const { selectedSessionId } = state
  if (!selectedSessionId) {
    console.log('no selected')
    return state
  }

  console.log('before open')
  await RendererWorker.invoke(`Main.openUri`, `chat-debug://${selectedSessionId}`)
  console.log('after open')

  return state
}
