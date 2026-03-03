import { FileSystemReadFile } from '../../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import { executeFileSystemCommand } from './executeFileSystemCommand.ts'
import { isPathTraversalAttempt } from './isPathTraversalAttempt.ts'
import { normalizeRelativePath } from './normalizeRelativePath.ts'
import type { ExecuteToolOptions } from './types.ts'

export const executeReadFileTool = async (args: Record<string, unknown>, options: ExecuteToolOptions): Promise<string> => {
  const filePath = typeof args.path === 'string' ? args.path : ''
  if (!filePath || isPathTraversalAttempt(filePath)) {
    return JSON.stringify({ error: 'Access denied: path must be relative and stay within the open workspace folder.' })
  }
  const normalizedPath = normalizeRelativePath(filePath)
  try {
    const content = await executeFileSystemCommand(FileSystemReadFile, ['file', normalizedPath], options)
    return JSON.stringify({ content, path: normalizedPath })
  } catch (error) {
    return JSON.stringify({ error: String(error), path: normalizedPath })
  }
}
