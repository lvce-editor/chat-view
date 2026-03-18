import type { ExecuteToolOptions } from '../Types/Types.ts'
import * as ChatToolRequest from '../ChatToolRequest/ChatToolRequest.ts'

const stringifyToolOutput = (output: unknown): string => {
  if (typeof output === 'string') {
    return output
  }
  return JSON.stringify(output) ?? 'null'
}

export const executeChatTool = async (name: string, rawArguments: unknown, options: ExecuteToolOptions): Promise<string> => {
  if (!options.useChatToolWorker) {
    throw new Error('Chat tools must be executed in a web worker environment. Please set useChatToolWorker to true in the options.')
  }
  const workerOutput = await ChatToolRequest.execute(name, rawArguments, {
    assetDir: options.assetDir,
    platform: options.platform,
  })
  return stringifyToolOutput(workerOutput)
}
