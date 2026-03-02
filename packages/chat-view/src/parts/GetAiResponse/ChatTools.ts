import * as ExtensionHostShared from '../ExtensionHost/ExtensionHostShared.ts'
import { OnFileSystem } from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import { FileSystemReadDirWithFileTypes, FileSystemReadFile, FileSystemWriteFile } from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'

type ChatTool = {
  readonly type: 'function'
  readonly function: {
    readonly name: string
    readonly description: string
    readonly parameters: {
      readonly type: 'object'
      readonly properties: Record<string, unknown>
      readonly required?: readonly string[]
      readonly additionalProperties: boolean
    }
  }
}

type ExecuteToolOptions = {
  readonly assetDir: string
  readonly platform: number
}

const isPathTraversalAttempt = (path: string): boolean => {
  if (!path) {
    return false
  }
  if (path.startsWith('/') || path.startsWith('\\')) {
    return true
  }
  if (path.startsWith('file://')) {
    return true
  }
  if (/^[a-zA-Z]:[\\/]/.test(path)) {
    return true
  }
  const segments = path.split(/[\\/]/)
  return segments.includes('..')
}

const normalizeRelativePath = (path: string): string => {
  const segments = path.split(/[\\/]/).filter((segment) => segment && segment !== '.')
  if (segments.length === 0) {
    return '.'
  }
  return segments.join('/')
}

const parseToolArguments = (rawArguments: unknown): Record<string, unknown> => {
  if (typeof rawArguments !== 'string') {
    return {}
  }
  try {
    const parsed = JSON.parse(rawArguments) as unknown
    if (!parsed || typeof parsed !== 'object') {
      return {}
    }
    return parsed as Record<string, unknown>
  } catch {
    return {}
  }
}

const executeFileSystemCommand = async (method: string, params: readonly unknown[], options: ExecuteToolOptions): Promise<unknown> => {
  return ExtensionHostShared.executeProvider({
    assetDir: options.assetDir,
    event: OnFileSystem,
    method,
    noProviderFoundMessage: 'No file system provider found',
    params,
    platform: options.platform,
  })
}

export const getBasicChatTools = (): readonly ChatTool[] => {
  return [
    {
      function: {
        description: 'Read UTF-8 text content from a file inside the currently open workspace folder.',
        name: 'read_file',
        parameters: {
          additionalProperties: false,
          properties: {
            path: {
              description: 'Relative file path within the workspace (for example: src/index.ts).',
              type: 'string',
            },
          },
          required: ['path'],
          type: 'object',
        },
      },
      type: 'function',
    },
    {
      function: {
        description: 'Write UTF-8 text content to a file inside the currently open workspace folder.',
        name: 'write_file',
        parameters: {
          additionalProperties: false,
          properties: {
            content: {
              description: 'New UTF-8 text content to write to the file.',
              type: 'string',
            },
            path: {
              description: 'Relative file path within the workspace (for example: src/index.ts).',
              type: 'string',
            },
          },
          required: ['path', 'content'],
          type: 'object',
        },
      },
      type: 'function',
    },
    {
      function: {
        description: 'List direct children (files and folders) for a folder inside the currently open workspace folder.',
        name: 'list_files',
        parameters: {
          additionalProperties: false,
          properties: {
            path: {
              description: 'Relative folder path within the workspace. Use "." for the workspace root.',
              type: 'string',
            },
          },
          type: 'object',
        },
      },
      type: 'function',
    },
  ]
}

export const executeChatTool = async (name: string, rawArguments: unknown, options: ExecuteToolOptions): Promise<string> => {
  const args = parseToolArguments(rawArguments)
  if (name === 'read_file') {
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
      const entries = await executeFileSystemCommand(FileSystemReadDirWithFileTypes, ['file', normalizedPath], options)
      return JSON.stringify({ entries, path: normalizedPath })
    } catch (error) {
      return JSON.stringify({ error: String(error), path: normalizedPath })
    }
  }

  return JSON.stringify({ error: `Unknown tool: ${name}` })
}
