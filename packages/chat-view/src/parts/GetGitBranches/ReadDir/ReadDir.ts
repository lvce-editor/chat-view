import { RendererWorker } from '@lvce-editor/rpc-registry'
import { parseEntries, type FileSystemEntry } from '../ParseEntries/ParseEntries.ts'
import { toFileSystemTarget } from '../ToFileSystemTarget/ToFileSystemTarget.ts'

export const readDir = async (workspaceUri: string, uri: string): Promise<readonly FileSystemEntry[]> => {
  const result = await RendererWorker.invoke('FileSystem.readDirWithFileTypes', toFileSystemTarget(workspaceUri, uri))
  return parseEntries(result)
}
