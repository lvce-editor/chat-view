import { RendererWorker } from '@lvce-editor/rpc-registry'

export const openFolder = async (): Promise<string> => {
  try {
    return await RendererWorker.invoke('FilePicker.showDirectoryPicker')
  } catch {
    return ''
  }
}
