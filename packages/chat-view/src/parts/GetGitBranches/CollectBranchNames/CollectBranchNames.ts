import { readDir } from '../ReadDir/ReadDir.ts'
import { toGitUri } from '../ToGitUri/ToGitUri.ts'

const FileTypeFile = 1
const FileTypeDirectory = 2

export const collectBranchNames = async (workspaceUri: string, refsHeadsUri: string, prefix: string, branches: Set<string>): Promise<void> => {
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
