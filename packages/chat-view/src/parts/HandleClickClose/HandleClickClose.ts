import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const handleClickClose = async (): Promise<void> => {
  if (RendererProcess.isConnected()) {
    await RendererProcess.invoke('Viewlet.forwardRendererWorkerCommand', 'Layout.hideSecondarySideBar')
    return
  }
  // @ts-ignore
  await RendererWorker.invoke('Layout.hideSecondarySideBar')
}
