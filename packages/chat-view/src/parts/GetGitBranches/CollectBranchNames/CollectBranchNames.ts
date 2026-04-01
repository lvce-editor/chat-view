import { readDir } from '../ReadDir/ReadDir.ts'
import { toGitUri } from '../ToGitUri/ToGitUri.ts'

const FileTypeFile = 1
const FileTypeDirectory = 2

export const collectBranchNames = async (workspaceUri: string, refsHeadsUri: string, prefix: string): Promise<readonly string[]> => {
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
