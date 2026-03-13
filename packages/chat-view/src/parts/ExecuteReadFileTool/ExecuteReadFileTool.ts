import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExecuteToolOptions } from '../Types/Types.ts'
import { isPathTraversalAttempt } from '../IsPathTraversalAttempt/IsPathTraversalAttempt.ts'
import { normalizeRelativePath } from '../NormalizeRelativePath/NormalizeRelativePath.ts'

const isAbsoluteUri = (value: string): boolean => {
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(value)
}

export const executeReadFileTool = async (args: Readonly<Record<string, unknown>>, _options: ExecuteToolOptions): Promise<string> => {
  const uri = typeof args.uri === 'string' ? args.uri : ''
  if (uri) {
    if (!isAbsoluteUri(uri)) {
      return JSON.stringify({ error: 'Invalid argument: uri must be an absolute URI.' })
    }
    try {
      const content = await RendererWorker.readFile(uri)
      return JSON.stringify({ content, uri })
    } catch (error) {
      return JSON.stringify({
        error: String(error),
        ...(error instanceof Error && typeof error.stack === 'string'
          ? {
              stack: error.stack,
            }
          : {}),
        uri,
      })
    }
  }

  const filePath = typeof args.path === 'string' ? args.path : ''
  if (!filePath || isPathTraversalAttempt(filePath)) {
    return JSON.stringify({ error: 'Access denied: path must be relative and stay within the open workspace folder.' })
  }
  const normalizedPath = normalizeRelativePath(filePath)
  try {
    const content = await RendererWorker.readFile(normalizedPath)
    return JSON.stringify({ content, path: normalizedPath })
  } catch (error) {
    return JSON.stringify({
      error: String(error),
      ...(error instanceof Error && typeof error.stack === 'string'
        ? {
            stack: error.stack,
          }
        : {}),
      path: normalizedPath,
    })
  }
}
