import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExecuteToolOptions } from '../Types/Types.ts'
import { isPathTraversalAttempt } from '../IsPathTraversalAttempt/IsPathTraversalAttempt.ts'
import { normalizeRelativePath } from '../NormalizeRelativePath/NormalizeRelativePath.ts'

export const executeReadFileTool = async (args: Readonly<Record<string, unknown>>, _options: ExecuteToolOptions): Promise<string> => {
  const filePath = typeof args.path === 'string' ? args.path : ''
  if (!filePath || isPathTraversalAttempt(filePath)) {
    return JSON.stringify({ error: 'Access denied: path must be relative and stay within the open workspace folder.' })
  }
  const normalizedPath = normalizeRelativePath(filePath)
  try {
    const content = await RendererWorker.readFile(normalizedPath)
    return JSON.stringify({ content, path: normalizedPath })
  } catch (error) {
    return JSON.stringify({ error: String(error), path: normalizedPath })
  }
}
