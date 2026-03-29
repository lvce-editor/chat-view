// cspell:ignore gitdir worktrees
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { GitBranch } from '../GitBranch/GitBranch.ts'

const FileTypeFile = 1
const FileTypeDirectory = 2
const slashAtEndRegex = /\/$/
const gitDirPointerRegex = /^gitdir:\s*(.+)$/m
const headRefRegex = /^ref:\s+refs\/heads\/(.+)$/m

interface FileSystemEntry {
  readonly name: string
  readonly type: number
}

const toGitUri = (baseUri: string, ...segments: readonly string[]): string => {
  const url = new URL(baseUri.endsWith('/') ? baseUri : `${baseUri}/`)
  for (const segment of segments) {
    url.pathname = `${url.pathname.replace(slashAtEndRegex, '')}/${segment
      .split('/')
      .map((part) => encodeURIComponent(part))
      .join('/')}`
  }
  return url.toString()
}

const decodeFileContent = (content: unknown): string => {
  if (typeof content === 'string') {
    return content
  }
  if (content instanceof Uint8Array) {
    return new TextDecoder().decode(content)
  }
  if (Array.isArray(content)) {
    return new TextDecoder().decode(new Uint8Array(content))
  }
  return ''
}

const toFileSystemPath = (uri: string): string => {
  if (!uri.startsWith('file://')) {
    return uri
  }
  return decodeURIComponent(new URL(uri).pathname)
}

const getRelativePath = (fromPath: string, toPath: string): string => {
  if (!fromPath.startsWith('/') || !toPath.startsWith('/')) {
    return toPath
  }
  const fromParts = fromPath.split('/').filter(Boolean)
  const toParts = toPath.split('/').filter(Boolean)
  let commonPrefixLength = 0
  while (
    commonPrefixLength < fromParts.length &&
    commonPrefixLength < toParts.length &&
    fromParts[commonPrefixLength] === toParts[commonPrefixLength]
  ) {
    commonPrefixLength++
  }
  const parentSegments = fromParts.slice(commonPrefixLength).map(() => '..')
  const childSegments = toParts.slice(commonPrefixLength)
  return [...parentSegments, ...childSegments].join('/') || '.'
}

const toFileSystemTarget = (workspaceUri: string, uri: string): string => {
  const workspacePath = toFileSystemPath(workspaceUri)
  const fileSystemPath = toFileSystemPath(uri)
  if (!workspaceUri.startsWith('file://') || !uri.startsWith('file://')) {
    return fileSystemPath
  }
  return getRelativePath(workspacePath, fileSystemPath)
}

const parseEntries = (value: unknown): readonly FileSystemEntry[] => {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .map((entry) => {
      if (Array.isArray(entry) && typeof entry[0] === 'string' && typeof entry[1] === 'number') {
        return {
          name: entry[0],
          type: entry[1],
        }
      }
      if (entry && typeof entry === 'object' && typeof Reflect.get(entry, 'name') === 'string' && typeof Reflect.get(entry, 'type') === 'number') {
        return {
          name: Reflect.get(entry, 'name'),
          type: Reflect.get(entry, 'type'),
        }
      }
      return undefined
    })
    .filter((entry): entry is FileSystemEntry => !!entry)
}

const readDir = async (workspaceUri: string, uri: string): Promise<readonly FileSystemEntry[]> => {
  const result = await RendererWorker.invoke('FileSystem.readDirWithFileTypes', toFileSystemTarget(workspaceUri, uri))
  return parseEntries(result)
}

const readTextFile = async (workspaceUri: string, uri: string): Promise<string> => {
  const result = await RendererWorker.invoke('FileSystem.readFile', toFileSystemTarget(workspaceUri, uri))
  return decodeFileContent(result)
}

const getGitDirUri = async (workspaceUri: string): Promise<string> => {
  const gitUri = toGitUri(workspaceUri, '.git')
  try {
    await readTextFile(workspaceUri, toGitUri(gitUri, 'HEAD'))
    return gitUri
  } catch {
    // Fall through to support worktrees/submodules where .git is a pointer file.
  }
  const gitPointer = await readTextFile(workspaceUri, gitUri)
  const match = gitDirPointerRegex.exec(gitPointer)
  if (!match) {
    return ''
  }
  return new URL(match[1].trim(), workspaceUri.endsWith('/') ? workspaceUri : `${workspaceUri}/`).toString()
}

const collectBranchNames = async (workspaceUri: string, refsHeadsUri: string, prefix: string, branches: Set<string>): Promise<void> => {
  const entries = await readDir(workspaceUri, refsHeadsUri)
  for (const entry of entries) {
    if (entry.type === FileTypeDirectory) {
      await collectBranchNames(workspaceUri, toGitUri(refsHeadsUri, entry.name), `${prefix}${entry.name}/`, branches)
      continue
    }
    if (entry.type === FileTypeFile) {
      branches.add(`${prefix}${entry.name}`)
    }
  }
}

const parseCurrentBranch = (headContent: string): string => {
  const match = headRefRegex.exec(headContent.trim())
  if (match) {
    return match[1].trim()
  }
  return ''
}

export const hasGitRepository = async (workspaceUri: string): Promise<boolean> => {
  try {
    return Boolean(await getGitDirUri(workspaceUri))
  } catch {
    return false
  }
}

export const getGitBranches = async (workspaceUri: string): Promise<readonly GitBranch[]> => {
  const gitDirUri = await getGitDirUri(workspaceUri)
  if (!gitDirUri) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new globalThis.Error('Git repository not found.')
  }
  const branches = new Set<string>()
  let currentBranch = ''
  try {
    const headContent = await readTextFile(workspaceUri, toGitUri(gitDirUri, 'HEAD'))
    currentBranch = parseCurrentBranch(headContent)
    if (currentBranch) {
      branches.add(currentBranch)
    }
  } catch {
    // Keep trying to discover branches from refs even if HEAD cannot be read.
  }
  try {
    await collectBranchNames(workspaceUri, toGitUri(gitDirUri, 'refs', 'heads'), '', branches)
  } catch {
    // Repositories without local refs should still open and surface any current branch we found.
  }
  if (branches.size === 0) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new globalThis.Error('No local git branches found.')
  }
  return [...branches]
    .toSorted((a, b) => a.localeCompare(b))
    .map((name) => ({
      current: name === currentBranch,
      name,
    }))
}
