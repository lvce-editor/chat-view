import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

const forwardLayoutCommand = (layoutCommand: string): void => {
  setTimeout(() => {
    void RendererProcess.invoke('Viewlet.forwardRendererWorkerCommand', layoutCommand)
  }, 0)
}

const deferredRendererWorkerCommands = new Set([
  'handleChatInputContextMenu',
  'handleChatListContextMenu',
  'handleContextMenuChatImageAttachment',
  'handleMessagesContextMenu',
  'handleProjectAddButtonContextMenu',
  'handleProjectListContextMenu',
])

export const handleMessagePort = async (
  port: MessagePort,
  viewletCommandMap: Readonly<Record<string, unknown>>,
  setAsRendererProcess = true,
): Promise<void> => {
  const executeViewletCommand = async (uid: number, command: string, ...args: readonly any[]): Promise<void> => {
    if (command === 'handleClickClose') {
      // Forward after this direct event returns so layout callbacks use an idle worker RPC.
      forwardLayoutCommand('Layout.hideSecondarySideBar')
      return
    }
    const fn = viewletCommandMap[`Chat.${command}`]
    if (typeof fn !== 'function') {
      throw new TypeError(`Viewlet command not found: ${command}`)
    }
    if (deferredRendererWorkerCommands.has(command)) {
      // These handlers call back into the renderer worker. Let the originating
      // renderer-worker -> renderer-process pointer action finish first.
      setTimeout(() => {
        void (async (): Promise<void> => {
          await fn(uid, ...args)
          await RendererWorker.invoke('Viewlet.requestRender', uid)
        })()
      }, 0)
      return
    }
    await fn(uid, ...args)
    await RendererWorker.invoke('Viewlet.requestRender', uid)
  }

  const rpc = await PlainMessagePortRpc.create({
    commandMap: {
      'Viewlet.executeViewletCommand': executeViewletCommand,
    },
    messagePort: port,
  })
  if (setAsRendererProcess) {
    RendererProcess.set(rpc)
  }
}
