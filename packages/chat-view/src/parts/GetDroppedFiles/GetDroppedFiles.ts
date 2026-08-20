import { DragAndDropWorker, RendererWorker } from '@lvce-editor/rpc-registry'

interface FileHandleTransportItem {
  readonly value: FileSystemHandle
}

export const getDroppedFiles = async (dropIdOrFileHandles: number | readonly number[]): Promise<readonly FileSystemFileHandle[]> => {
  if (typeof dropIdOrFileHandles === 'number') {
    return DragAndDropWorker.getDroppedFileHandlesByDropId(dropIdOrFileHandles)
  }
  // TODO adjust e2e test and remove this code
  if (dropIdOrFileHandles.some((item: any): boolean => typeof item !== 'number')) {
    return dropIdOrFileHandles.map((item: any): any => {
      return {
        getFile(): any {
          return item
        },
      }
    })
  }
  const actualHandles = await RendererWorker.getFileHandles(dropIdOrFileHandles)
  return (
    actualHandles
      // @ts-ignore
      .map((item: FileHandleTransportItem): FileSystemHandle => item.value)
      .filter((item): item is FileSystemFileHandle => item.kind === 'file')
  )
}
