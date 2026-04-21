import { RendererWorker } from '@lvce-editor/rpc-registry'

export const get = async (key: string): Promise<unknown> => {
  return RendererWorker.getPreference(key)
}
