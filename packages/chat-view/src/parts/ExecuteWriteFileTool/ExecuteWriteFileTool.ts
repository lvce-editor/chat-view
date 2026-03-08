import type { ExecuteToolOptions } from '../Types/Types.ts'
import { executeFileSystemCommand } from '../ExecuteFileSystemCommand/ExecuteFileSystemCommand.ts'
import { FileSystemWriteFile } from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import { isPathTraversalAttempt } from '../IsPathTraversalAttempt/IsPathTraversalAttempt.ts'
import { normalizeRelativePath } from '../NormalizeRelativePath/NormalizeRelativePath.ts'

export const executeWriteFileTool = async (args: Readonly<Record<string, unknown>>, options: ExecuteToolOptions): Promise<string> => {
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
