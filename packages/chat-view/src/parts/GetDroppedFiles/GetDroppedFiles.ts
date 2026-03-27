import { RendererWorker } from '@lvce-editor/rpc-registry'

interface FileHandleTransportItem {
  readonly value: FileSystemHandle
}

export const getDroppedFiles = async (fileHandles: readonly number[]): Promise<readonly FileSystemFileHandle[]> => {
  const actualHandles = await RendererWorker.getFileHandles(fileHandles)
  return actualHandles
    .map((item) => (item as unknown as FileHandleTransportItem).value)
    .filter((item): item is FileSystemFileHandle => item.kind === 'file')
}
