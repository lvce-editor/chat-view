import { RendererWorker } from '@lvce-editor/rpc-registry'

export const handleClickLink = async (href: string): Promise<void> => {
  if (!href) {
    return
  }
  await RendererWorker.openExternal(href)
}
