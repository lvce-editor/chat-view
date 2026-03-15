import { RendererWorker } from '@lvce-editor/rpc-registry'

export const handleClickSettings = async (): Promise<void> => {
  await RendererWorker.invoke('Main.openUri', 'app://settings.json')
}
