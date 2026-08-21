import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const show2 = async (uid: number, menuId: number, x: number, y: number, args: Readonly<Record<string, unknown>>): Promise<void> => {
  if (RendererProcess.isConnected()) {
    setTimeout(() => {
      void RendererProcess.invoke('Viewlet.forwardRendererWorkerCommand', 'ContextMenu.show2', uid, menuId, x, y, args)
    }, 0)
    return
  }
  await RendererWorker.showContextMenu2(uid, menuId, x, y, args)
}
