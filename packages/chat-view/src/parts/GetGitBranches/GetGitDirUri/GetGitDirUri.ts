// cspell:ignore gitdir worktrees
import { readTextFile } from '../ReadTextFile/ReadTextFile.ts'
import { toGitUri } from '../ToGitUri/ToGitUri.ts'

const gitDirPointerRegex = /^gitdir:\s*(.+)$/m

export const getGitDirUri = async (workspaceUri: string): Promise<string> => {
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
