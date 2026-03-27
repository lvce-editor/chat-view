import { RendererWorker } from '@lvce-editor/rpc-registry'

export const getDroppedFiles = async (fileHandles: readonly number[]): Promise<readonly FileSystemFileHandle[]> => {
  const actualFiles = await RendererWorker.getFileHandles(fileHandles)
  const parsed = actualFiles.map((item) => (item as any).value)
  return parsed
}
