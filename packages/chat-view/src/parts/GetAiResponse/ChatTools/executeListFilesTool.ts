import type { ExecuteToolOptions } from './types.ts'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { isPathTraversalAttempt } from './isPathTraversalAttempt.ts'
import { normalizeRelativePath } from './normalizeRelativePath.ts'

export const executeListFilesTool = async (args: Readonly<Record<string, unknown>>, _options: ExecuteToolOptions): Promise<string> => {
  const folderPath = typeof args.path === 'string' && args.path ? args.path : '.'
  if (isPathTraversalAttempt(folderPath)) {
    return JSON.stringify({ error: 'Access denied: path must be relative and stay within the open workspace folder.' })
  }
  const normalizedPath = normalizeRelativePath(folderPath)
  try {
    const entries = await RendererWorker.invoke('FileSystem.readDirWithFileTypes', normalizedPath)
    return JSON.stringify({ entries, path: normalizedPath })
  } catch (error) {
    return JSON.stringify({ error: String(error), path: normalizedPath })
  }
}
