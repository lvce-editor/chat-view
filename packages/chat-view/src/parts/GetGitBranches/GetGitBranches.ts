import type { GitBranch } from '../GitBranch/GitBranch.ts'
import { collectBranchNames } from './CollectBranchNames/CollectBranchNames.ts'
import { getGitDirUri } from './GetGitDirUri/GetGitDirUri.ts'
import { parseCurrentBranch } from './ParseCurrentBranch/ParseCurrentBranch.ts'
import { readTextFile } from './ReadTextFile/ReadTextFile.ts'
import { toGitUri } from './ToGitUri/ToGitUri.ts'

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
