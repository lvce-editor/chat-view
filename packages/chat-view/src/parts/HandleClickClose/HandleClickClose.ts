import { RendererWorker } from '@lvce-editor/rpc-registry'

export const handleClickClose = async (): Promise<void> => {
  // @ts-ignore
  await RendererWorker.invoke('Chat.terminate')
}
