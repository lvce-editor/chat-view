import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

let viewletCommandMap: Record<string, unknown> = Object.create(null)

export const setCommandMap = (commandMap: object): void => {
  viewletCommandMap = commandMap as Record<string, unknown>
}

const executeViewletCommand = async (uid: number, command: string, ...args: readonly any[]): Promise<void> => {
  const fn = viewletCommandMap[`Chat.${command}`]
  if (typeof fn !== 'function') {
    throw new Error(`Viewlet command not found: ${command}`)
  }
  await fn(uid, ...args)
  await RendererWorker.invoke('Viewlet.requestRender', uid)
}

export const handleMessagePort = async (port: MessagePort): Promise<void> => {
  const rpc = await PlainMessagePortRpc.create({
    commandMap: {
      'Viewlet.executeViewletCommand': executeViewletCommand,
    },
    messagePort: port,
  })
  RendererProcess.set(rpc)
}
