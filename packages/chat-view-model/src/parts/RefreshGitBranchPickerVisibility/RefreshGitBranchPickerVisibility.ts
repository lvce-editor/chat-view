import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession, GitBranch, Project } from '../ViewModel/ViewModel.ts'

interface BranchPickerState {
  readonly gitBranchPickerErrorMessage: string
  readonly gitBranchPickerOpen: boolean
  readonly gitBranchPickerVisible: boolean
  readonly gitBranches: readonly GitBranch[]
  readonly projects: readonly Project[]
  readonly selectedProjectId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly viewMode: 'list' | 'detail' | 'chat-focus'
}

const getSelectedSession = (sessions: readonly ChatSession[], selectedSessionId: string): ChatSession | undefined => {
  return sessions.find((session) => session.id === selectedSessionId)
}

const getProjectUri = (state: BranchPickerState, projectId: string): string => {
  return state.projects.find((project) => project.id === projectId)?.uri || ''
}

const getWorkspaceUri = (state: BranchPickerState, session: ChatSession | undefined): string => {
  if (session?.workspaceUri) {
    return session.workspaceUri
  }
  return getProjectUri(state, session?.projectId || state.selectedProjectId)
}

const withHiddenBranchPicker = <TState extends BranchPickerState>(state: TState): TState => {
  return {
    ...state,
    gitBranches: [],
    gitBranchPickerErrorMessage: '',
    gitBranchPickerOpen: false,
    gitBranchPickerVisible: false,
  }
}

interface FileSystemEntry {
  readonly name: string
  readonly type: number
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

const readTextFile = async (workspaceUri: string, uri: string): Promise<string> => {
  const result = await RendererWorker.invoke('FileSystem.readFile', toFileSystemTarget(workspaceUri, uri))
  return decodeFileContent(result)
}

const parseEntries = (value: unknown): readonly FileSystemEntry[] => {
  if (!Array.isArray(value)) {
    return []
  }
  return value.flatMap((entry) => {
    if (Array.isArray(entry) && typeof entry[0] === 'string' && typeof entry[1] === 'number') {
      return [{ name: entry[0], type: entry[1] }]
    }
    if (entry && typeof entry === 'object' && typeof Reflect.get(entry, 'name') === 'string' && typeof Reflect.get(entry, 'type') === 'number') {
      return [{ name: Reflect.get(entry, 'name'), type: Reflect.get(entry, 'type') }]
    }
    return []
  })
}

const readDir = async (workspaceUri: string, uri: string): Promise<readonly FileSystemEntry[]> => {
  const result = await RendererWorker.invoke('FileSystem.readDirWithFileTypes', toFileSystemTarget(workspaceUri, uri))
  return parseEntries(result)
}

const slashAtEndRegex = /\/$/

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

const headRefRegex = /^ref:\s+refs\/heads\/(.+)$/m

const parseCurrentBranch = (headContent: string): string => {
  const match = headRefRegex.exec(headContent.trim())
  if (match) {
    return match[1].trim()
  }
  return ''
}

const gitDirPointerRegex = /^gitdir:\s*(.+)$/m

const getGitDirUri = async (workspaceUri: string): Promise<string> => {
  const gitUri = toGitUri(workspaceUri, '.git')
  try {
    await readTextFile(workspaceUri, toGitUri(gitUri, 'HEAD'))
    return gitUri
  } catch {
    // Support worktrees/submodules where .git is a pointer file.
  }
  const gitPointer = await readTextFile(workspaceUri, gitUri)
  const match = gitDirPointerRegex.exec(gitPointer)
  if (!match) {
    return ''
  }
  return new URL(match[1].trim(), workspaceUri.endsWith('/') ? workspaceUri : `${workspaceUri}/`).toString()
}

const FileTypeFile = 1
const FileTypeDirectory = 2

const collectBranchNames = async (workspaceUri: string, refsHeadsUri: string, prefix: string): Promise<readonly string[]> => {
  const entries = await readDir(workspaceUri, refsHeadsUri)
  const branches: string[] = []
  for (const entry of entries) {
    if (entry.type === FileTypeDirectory) {
      branches.push(...(await collectBranchNames(workspaceUri, toGitUri(refsHeadsUri, entry.name), `${prefix}${entry.name}/`)))
      continue
    }
    if (entry.type === FileTypeFile) {
      branches.push(`${prefix}${entry.name}`)
    }
  }
  return branches
}

const getGitBranches = async (workspaceUri: string): Promise<readonly GitBranch[]> => {
  const gitDirUri = await getGitDirUri(workspaceUri)
  if (!gitDirUri) {
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
    // Continue and discover branches from refs.
  }
  try {
    const discoveredBranches = await collectBranchNames(workspaceUri, toGitUri(gitDirUri, 'refs', 'heads'), '')
    for (const branch of discoveredBranches) {
      branches.add(branch)
    }
  } catch {
    // Repositories without local refs should still open.
  }
  if (branches.size === 0) {
    throw new globalThis.Error('No local git branches found.')
  }
  return [...branches]
    .toSorted((a, b) => a.localeCompare(b))
    .map((name) => ({
      current: name === currentBranch,
      name,
    }))
}

const hasGitRepository = async (workspaceUri: string): Promise<boolean> => {
  try {
    return Boolean(await getGitDirUri(workspaceUri))
  } catch {
    return false
  }
}

export const refreshGitBranchPickerVisibility = async <TState extends BranchPickerState>(state: TState): Promise<TState> => {
  if (state.viewMode !== 'chat-focus') {
    return {
      ...state,
      gitBranchPickerErrorMessage: '',
      gitBranchPickerOpen: false,
    }
  }
  const selectedSession = getSelectedSession(state.sessions, state.selectedSessionId)
  const fallbackBranchName = selectedSession?.branchName || ''
  const workspaceUri = getWorkspaceUri(state, selectedSession)
  if (!workspaceUri) {
    return withHiddenBranchPicker(state)
  }
  const visible = await hasGitRepository(workspaceUri)
  if (!visible) {
    if (fallbackBranchName) {
      return {
        ...state,
        gitBranches: [{ current: true, name: fallbackBranchName }],
        gitBranchPickerVisible: true,
      }
    }
    return withHiddenBranchPicker(state)
  }
  try {
    const gitBranches = await getGitBranches(workspaceUri)
    return {
      ...state,
      gitBranches,
      gitBranchPickerVisible: true,
    }
  } catch {
    if (fallbackBranchName) {
      return {
        ...state,
        gitBranches: [{ current: true, name: fallbackBranchName }],
        gitBranchPickerVisible: true,
      }
    }
    return {
      ...state,
      gitBranchPickerVisible: true,
    }
  }
}