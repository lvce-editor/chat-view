import { FileSystemWriteFile } from '../../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import { executeFileSystemCommand } from './executeFileSystemCommand.ts'
import { isPathTraversalAttempt } from './isPathTraversalAttempt.ts'
import { normalizeRelativePath } from './normalizeRelativePath.ts'
import type { ExecuteToolOptions } from './types.ts'

export const executeWriteFileTool = async (args: Record<string, unknown>, options: ExecuteToolOptions): Promise<string> => {
  const filePath = typeof args.path === 'string' ? args.path : ''
  const content = typeof args.content === 'string' ? args.content : ''
  if (!filePath || isPathTraversalAttempt(filePath)) {
    return JSON.stringify({ error: 'Access denied: path must be relative and stay within the open workspace folder.' })
  }
  const normalizedPath = normalizeRelativePath(filePath)
  try {
    await executeFileSystemCommand(FileSystemWriteFile, ['file', normalizedPath, content], options)
    return JSON.stringify({ ok: true, path: normalizedPath })
  } catch (error) {
    return JSON.stringify({ error: String(error), path: normalizedPath })
  }
}
