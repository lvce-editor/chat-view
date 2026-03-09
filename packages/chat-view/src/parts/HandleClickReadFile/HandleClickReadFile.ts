import { RendererWorker } from '@lvce-editor/rpc-registry'

export const handleClickReadFile = async (uri: string): Promise<void> => {
  if (!uri) {
    return
  }
  await RendererWorker.invoke('Main.openUri', uri)
}
