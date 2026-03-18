import type { ExecuteToolOptions } from '../Types/Types.ts'
import * as ChatToolRequest from '../ChatToolRequest/ChatToolRequest.ts'
import { executeAskQuestionTool } from '../ExecuteAskQuestionTool/ExecuteAskQuestionTool.ts'
import { executeGetWorkspaceUriTool } from '../ExecuteGetWorkspaceUriTool/ExecuteGetWorkspaceUriTool.ts'
import { executeListFilesTool } from '../ExecuteListFilesTool/ExecuteListFilesTool.ts'
import { executeReadFileTool } from '../ExecuteReadFileTool/ExecuteReadFileTool.ts'
import { executeRenderHtmlTool } from '../ExecuteRenderHtmlTool/ExecuteRenderHtmlTool.ts'
import { executeWriteFileTool } from '../ExecuteWriteFileTool/ExecuteWriteFileTool.ts'
import { parseToolArguments } from '../ParseToolArguments/ParseToolArguments.ts'

const stringifyToolOutput = (output: unknown): string => {
  if (typeof output === 'string') {
    return output
  }
  return JSON.stringify(output) ?? 'null'
}

export const executeChatTool = async (name: string, rawArguments: unknown, options: ExecuteToolOptions): Promise<string> => {
  if (options.useChatToolWorker) {
    const workerOutput = await ChatToolRequest.execute(name, rawArguments, {
      assetDir: options.assetDir,
      platform: options.platform,
    })
    return stringifyToolOutput(workerOutput)
  }
  const args = parseToolArguments(rawArguments)
  if (name === 'read_file') {
    return executeReadFileTool(args, options)
  }

  if (name === 'write_file') {
    return executeWriteFileTool(args, options)
  }

  if (name === 'list_files') {
    return executeListFilesTool(args, options)
  }

  if (name === 'getWorkspaceUri') {
    return executeGetWorkspaceUriTool(args, options)
  }

  if (name === 'render_html') {
    return executeRenderHtmlTool(args, options)
  }

  if (name === 'ask_question') {
    return executeAskQuestionTool(args)
  }

  return JSON.stringify({ error: `Unknown tool: ${name}` })
}
