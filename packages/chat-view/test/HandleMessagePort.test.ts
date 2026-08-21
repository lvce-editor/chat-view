import { expect, jest, test } from '@jest/globals'
import { createMockRpc, PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererProcess as RendererProcessRegistry, RendererWorker } from '@lvce-editor/rpc-registry'
import { handleMessagePort } from '../src/parts/HandleMessagePort/HandleMessagePort.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

test('connects the view directly to the renderer process', async () => {
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 31)
  const { promise: forwardedCommand, resolve: resolveForwardedCommand } = Promise.withResolvers<void>()
  const forwardRendererWorkerCommand = jest.fn((_method: string) => {
    resolveForwardedCommand()
  })
  const { port1, port2 } = new MessageChannel()
  const rendererProcessRpc = await PlainMessagePortRpcParent.create({
    commandMap: {
      'Viewlet.forwardRendererWorkerCommand': forwardRendererWorkerCommand,
      'Viewlet.queueCommands': queueCommands,
    },
    messagePort: port1,
  })
  const handleInput = jest.fn(async (_uid: number, _value: string) => {})
  const handleClickClose = jest.fn(async (_uid: number) => {})
  const { promise: contextMenuHandled, resolve: resolveContextMenuHandled } = Promise.withResolvers<void>()
  const handleChatInputContextMenu = jest.fn(async (_uid: number, _x: number, _y: number) => {
    resolveContextMenuHandled()
  })

  await handleMessagePort(port2, {
    'Chat.handleChatInputContextMenu': handleChatInputContextMenu,
    'Chat.handleClickClose': handleClickClose,
    'Chat.handleInput': handleInput,
  })
  expect(RendererProcess.isConnected()).toBe(true)
  await expect(RendererProcess.invoke('Viewlet.queueCommands', 7, [['Viewlet.setDom2', 7, []]])).resolves.toBe(31)
  expect(queueCommands).toHaveBeenCalledWith(7, [['Viewlet.setDom2', 7, []]])

  const requestRender = jest.fn(async (_uid: number) => {})
  RendererWorker.set(
    Object.assign(
      createMockRpc({
        commandMap: {
          'Viewlet.requestRender': requestRender,
        },
      }),
      { dispose: jest.fn() },
    ),
  )
  await rendererProcessRpc.invoke('Viewlet.executeViewletCommand', 7, 'handleInput', 'hello')
  expect(handleInput).toHaveBeenCalledWith(7, 'hello')
  expect(requestRender).toHaveBeenCalledWith(7)

  await rendererProcessRpc.invoke('Viewlet.executeViewletCommand', 7, 'handleClickClose')
  await forwardedCommand
  expect(forwardRendererWorkerCommand).toHaveBeenCalledWith('Layout.hideSecondarySideBar')
  expect(handleClickClose).not.toHaveBeenCalled()
  expect(requestRender).toHaveBeenCalledTimes(1)

  await rendererProcessRpc.invoke('Viewlet.executeViewletCommand', 7, 'handleChatInputContextMenu', 10, 20)
  await contextMenuHandled
  await new Promise<void>((resolve) => setTimeout(resolve, 0))
  expect(handleChatInputContextMenu).toHaveBeenCalledWith(7, 10, 20)
  expect(requestRender).toHaveBeenCalledTimes(2)

  await expect(rendererProcessRpc.invoke('Viewlet.executeViewletCommand', 7, 'missing')).rejects.toThrow('Viewlet command not found: missing')

  await RendererProcessRegistry.dispose()
  await RendererWorker.dispose()
  await rendererProcessRpc.dispose()
})

test('keeps the renderer process rpc for a secondary direct connection', async () => {
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 31)
  RendererProcessRegistry.set(
    Object.assign(
      createMockRpc({
        commandMap: { 'Viewlet.queueCommands': queueCommands },
      }),
      { dispose: jest.fn() },
    ),
  )
  const { port1, port2 } = new MessageChannel()

  await handleMessagePort(port2, {}, false)

  expect(RendererProcess.invoke('Viewlet.queueCommands', 7, [])).toBe(31)
  expect(queueCommands).toHaveBeenCalledWith(7, [])

  port1.close()
  port2.close()
  await RendererProcessRegistry.dispose()
})
