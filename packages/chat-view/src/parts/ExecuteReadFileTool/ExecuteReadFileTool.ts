import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExecuteToolOptions } from '../Types/Types.ts'
import { getWorkspaceUri } from '../GetWorkspaceUri/GetWorkspaceUri.ts'
import { isPathTraversalAttempt } from '../IsPathTraversalAttempt/IsPathTraversalAttempt.ts'
import { normalizeRelativePath } from '../NormalizeRelativePath/NormalizeRelativePath.ts'
import { toRelativeWorkspacePath } from '../ToRelativeWorkspacePath/ToRelativeWorkspacePath.ts'

const getNormalizedReadPath = async (args: Readonly<Record<string, unknown>>): Promise<string | undefined> => {
  const fileUri = typeof args.uri === 'string' ? args.uri : ''
  if (fileUri) {
    const workspaceUri = await getWorkspaceUri()
    const relativePath = toRelativeWorkspacePath(workspaceUri, fileUri)
    if (!relativePath || isPathTraversalAttempt(relativePath)) {
      return undefined
    }
    return normalizeRelativePath(relativePath)
  }

  const filePath = typeof args.path === 'string' ? args.path : ''
  if (!filePath || isPathTraversalAttempt(filePath)) {
    return undefined
  }
  return normalizeRelativePath(filePath)
}

export const executeReadFileTool = async (args: Readonly<Record<string, unknown>>, _options: ExecuteToolOptions): Promise<string> => {
  const normalizedPath = await getNormalizedReadPath(args)
  if (!normalizedPath) {
    return JSON.stringify({ error: 'Access denied: path must be relative and stay within the open workspace folder.' })
  }
  try {
    const content = await RendererWorker.readFile(normalizedPath)
    return JSON.stringify({ content, path: normalizedPath })
  } catch (error) {
    return JSON.stringify({ error: String(error), path: normalizedPath })
  }
}
