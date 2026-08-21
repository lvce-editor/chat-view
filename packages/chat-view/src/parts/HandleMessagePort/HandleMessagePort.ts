import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

const forwardLayoutCommand = (layoutCommand: string): void => {
  setTimeout(() => {
    void RendererWorker.invoke(layoutCommand)
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
      // The renderer worker can be waiting for this direct invocation to
      // finish. Forward the layout command once that RPC is idle again.
      forwardLayoutCommand('Layout.hideSecondarySideBar')
      return
    }
    const fn = viewletCommandMap[`Chat.${command}`]
    if (typeof fn !== 'function') {
      throw new TypeError(`Viewlet command not found: ${command}`)
    }
    if (deferredRendererWorkerCommands.has(command)) {
      // Context-menu handlers call back into the renderer worker. Let the
      // originating pointer action or test command finish first.
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
