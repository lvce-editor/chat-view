import { expect, jest, test } from '@jest/globals'
import { createMockRpc, PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererProcess as RendererProcessRegistry, RendererWorker } from '@lvce-editor/rpc-registry'
import { handleMessagePort } from '../src/parts/HandleMessagePort/HandleMessagePort.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

test('connects the view directly to the renderer process', async () => {
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 31)
  const { port1, port2 } = new MessageChannel()
  const rendererProcessRpc = await PlainMessagePortRpcParent.create({
    commandMap: { 'Viewlet.queueCommands': queueCommands },
    messagePort: port1,
  })
  const handleInput = jest.fn(async (_uid: number, _value: string) => {})
  const handleClickClose = jest.fn(async (_uid: number) => {})

  await handleMessagePort(port2, {
    'Chat.handleClickClose': handleClickClose,
    'Chat.handleInput': handleInput,
  })
  expect(RendererProcess.isConnected()).toBe(true)
  await expect(RendererProcess.invoke('Viewlet.queueCommands', 7, [['Viewlet.setDom2', 7, []]])).resolves.toBe(31)
  expect(queueCommands).toHaveBeenCalledWith(7, [['Viewlet.setDom2', 7, []]])

  const requestRender = jest.fn(async (_uid: number) => {})
  const hideSecondarySideBar = jest.fn(async () => {})
  RendererWorker.set(
    Object.assign(
      createMockRpc({
        commandMap: {
          'Layout.hideSecondarySideBar': hideSecondarySideBar,
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
  expect(hideSecondarySideBar).toHaveBeenCalledTimes(1)
  expect(handleClickClose).not.toHaveBeenCalled()
  expect(requestRender).toHaveBeenCalledTimes(1)

  await expect(rendererProcessRpc.invoke('Viewlet.executeViewletCommand', 7, 'missing')).rejects.toThrow('Viewlet command not found: missing')

  await RendererProcessRegistry.dispose()
  await RendererWorker.dispose()
  await rendererProcessRpc.dispose()
})
