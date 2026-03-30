import { getGitDirUri } from '../GetGitDirUri/GetGitDirUri.ts'

export const hasGitRepository = async (workspaceUri: string): Promise<boolean> => {
  try {
    return Boolean(await getGitDirUri(workspaceUri))
  } catch {
    return false
  }
}
