import { RendererWorker } from '@lvce-editor/rpc-registry'

export const get = async (key: string): Promise<any> => {
  return RendererWorker.getPreference(key)
}

export const update = async (settings: Record<string, unknown>): Promise<void> => {
  await RendererWorker.invoke('Preferences.update', settings)
}
