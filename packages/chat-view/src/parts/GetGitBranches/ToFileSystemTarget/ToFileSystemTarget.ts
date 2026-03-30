import { getRelativePath } from '../GetRelativePath/GetRelativePath.ts'
import { toFileSystemPath } from '../ToFileSystemPath/ToFileSystemPath.ts'

export const toFileSystemTarget = (workspaceUri: string, uri: string): string => {
  const workspacePath = toFileSystemPath(workspaceUri)
  const fileSystemPath = toFileSystemPath(uri)
  if (!workspaceUri.startsWith('file://') || !uri.startsWith('file://')) {
    return fileSystemPath
  }
  return getRelativePath(workspacePath, fileSystemPath)
}
