import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatTool, ExecuteToolOptions } from '../types'
import { FileSystemWriteFile } from '../../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import { executeFileSystemCommand } from './executeFileSystemCommand'
import { getWorkspaceUri } from './getWorkspaceUri'
import { isAbsoluteFileUri } from './isAbsoluteFileUri'
import { isPathTraversalAttempt } from './isPathTraversalAttempt'
import { normalizeRelativePath } from './normalizeRelativePath'
import { parseToolArguments } from './parseToolArguments'
import { toRelativeWorkspacePath } from './toRelativeWorkspacePath'
import { validationError } from './validationError'

export const executeChatTool = async (name: string, rawArguments: unknown, options: ExecuteToolOptions): Promise<string> => {
  const args = parseToolArguments(rawArguments)
  if (name === 'get_current_workspace_uri') {
    try {
      const uri = await getWorkspaceUri()
      return JSON.stringify({ uri })
    } catch (error) {
      return JSON.stringify({ error: String(error) })
    }
  }

  if (name === 'read_file') {
    const fileUri = typeof args.uri === 'string' ? args.uri : ''
    if (!fileUri) {
      return validationError('Missing required argument `uri`.')
    }
    if (!isAbsoluteFileUri(fileUri)) {
      return validationError('`uri` must be an absolute file URI (for example: file:///workspace/package.json).')
    }
    let workspaceUri: string
    try {
      workspaceUri = await getWorkspaceUri()
    } catch (error) {
      return JSON.stringify({ error: String(error) })
    }
    const normalizedPath = toRelativeWorkspacePath(workspaceUri, fileUri)
    if (!normalizedPath || isPathTraversalAttempt(normalizedPath)) {
      return JSON.stringify({ error: 'Access denied: uri must point to a file within the current workspace folder.' })
    }
    try {
      const content = await RendererWorker.readFile(normalizedPath)
      return JSON.stringify({ content, path: normalizedPath, uri: fileUri })
    } catch (error) {
      return JSON.stringify({ error: String(error), path: normalizedPath, uri: fileUri })
    }
  }

  if (name === 'write_file') {
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

  if (name === 'list_files') {
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

  return JSON.stringify({ error: `Unknown tool: ${name}` })
}
