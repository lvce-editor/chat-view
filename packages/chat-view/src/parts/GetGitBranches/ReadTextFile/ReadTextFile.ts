import { RendererWorker } from '@lvce-editor/rpc-registry'
import { decodeFileContent } from '../DecodeFileContent/DecodeFileContent.ts'
import { toFileSystemTarget } from '../ToFileSystemTarget/ToFileSystemTarget.ts'

export const readTextFile = async (workspaceUri: string, uri: string): Promise<string> => {
  const result = await RendererWorker.invoke('FileSystem.readFile', toFileSystemTarget(workspaceUri, uri))
  return decodeFileContent(result)
}
