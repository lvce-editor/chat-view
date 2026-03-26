import { WebWorkerRpcClient } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { initializeChatCoordinatorWorker } from '../InitializeChatCoordinatorWorker/InitializeChatCoordinatorWorker.ts'
import { initializeChatMathWorker } from '../InitializeChatMathWorker/InitializeChatMathWorker.ts'
import { initializeChatMessageParsingWorker } from '../InitializeChatMessageParsingWorker/InitializeChatMessageParsingWorker.ts'
import { initializeChatNetworkWorker } from '../InitializeChatNetworkWorker/InitializeChatNetworkWorker.ts'
import { initializeChatStorageWorker } from '../InitializeChatStorageWorker/InitializeChatStorageWorker.ts'
import { initializeChatToolWorker } from '../InitializeChatToolWorker/InitializeChatToolWorker.ts'
import { initializeClipBoardWorker } from '../InitializeClipBoardWorker/InitializeClipBoardWorker.ts'
import { initializeOpenerWorker } from '../InitializeOpenerWorker/InitializeOpenerWorker.ts'
import { registerSlashCommands } from '../RegisterSlashCommands/RegisterSlashCommands.ts'
import { registerCommands } from '../StatusBarStates/StatusBarStates.ts'

export const listen = async (): Promise<void> => {
  registerSlashCommands()
  registerCommands(CommandMap.commandMap)
  const rpc = await WebWorkerRpcClient.create({
    commandMap: CommandMap.commandMap,
  })
  RendererWorker.set(rpc)
  await Promise.all([
    initializeChatCoordinatorWorker(),
    initializeChatMathWorker(),
    initializeChatMessageParsingWorker(),
    initializeChatNetworkWorker(),
    initializeChatStorageWorker(),
    initializeChatToolWorker(),
    initializeClipBoardWorker(),
    initializeOpenerWorker(),
  ])
}
