import { WebWorkerRpcClient } from '@lvce-editor/rpc'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { registerCommands } from '../State/ChatDebugViewStates.ts'

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)
  await WebWorkerRpcClient.create({
    commandMap: CommandMap.commandMap,
  })
}
