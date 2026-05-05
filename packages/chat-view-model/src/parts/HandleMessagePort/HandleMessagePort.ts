import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { commandMap } from '../CommandMap/CommandMap.ts'

export const handleMessagePort = async (port: Readonly<MessagePort>): Promise<void> => {
  await PlainMessagePortRpc.create({
    commandMap,
    isMessagePortOpen: true,
    messagePort: port,
  })
}
