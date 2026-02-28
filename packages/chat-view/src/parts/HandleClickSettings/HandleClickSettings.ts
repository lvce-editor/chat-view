import { RendererWorker } from '@lvce-editor/rpc-registry'

export const handleClickSettings = async (): Promise<void> => {
  // TODO
  await RendererWorker.invoke('Main.openUri', 'app://settings.json')
}
