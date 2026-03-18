import { ChatToolWorker } from '@lvce-editor/rpc-registry'
import type { ChatTool, ExecuteToolOptions } from '../Types/Types.ts'

export const execute = async (name: string, rawArguments: unknown, options: ExecuteToolOptions): Promise<string> => {
  return ChatToolWorker.invoke('ChatTool.execute', name, rawArguments, options) as Promise<string>
}

export const getTools = async (): Promise<readonly ChatTool[]> => {
  return ChatToolWorker.invoke('ChatTool.getTools') as Promise<readonly ChatTool[]>
}
