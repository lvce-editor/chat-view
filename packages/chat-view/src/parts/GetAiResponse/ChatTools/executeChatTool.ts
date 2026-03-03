import { executeListFilesTool } from './executeListFilesTool.ts'
import { executeReadFileTool } from './executeReadFileTool.ts'
import { executeWriteFileTool } from './executeWriteFileTool.ts'
import { parseToolArguments } from './parseToolArguments.ts'
import type { ExecuteToolOptions } from './types.ts'

export const executeChatTool = async (name: string, rawArguments: unknown, options: ExecuteToolOptions): Promise<string> => {
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

  return JSON.stringify({ error: `Unknown tool: ${name}` })
}
