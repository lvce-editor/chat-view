import { FileSystemReadDirWithFileTypes } from '../../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import { executeFileSystemCommand } from './executeFileSystemCommand.ts'
import { isPathTraversalAttempt } from './isPathTraversalAttempt.ts'
import { normalizeRelativePath } from './normalizeRelativePath.ts'
import type { ExecuteToolOptions } from './types.ts'

export const executeListFilesTool = async (args: Record<string, unknown>, options: ExecuteToolOptions): Promise<string> => {
  const folderPath = typeof args.path === 'string' && args.path ? args.path : '.'
  if (isPathTraversalAttempt(folderPath)) {
    return JSON.stringify({ error: 'Access denied: path must be relative and stay within the open workspace folder.' })
  }
  const normalizedPath = normalizeRelativePath(folderPath)
  try {
    const entries = await executeFileSystemCommand(FileSystemReadDirWithFileTypes, ['file', normalizedPath], options)
    return JSON.stringify({ entries, path: normalizedPath })
  } catch (error) {
    return JSON.stringify({ error: String(error), path: normalizedPath })
  }
}
