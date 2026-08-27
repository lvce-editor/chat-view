import { getObjectProperty } from '../../GetObjectProperty/GetObjectProperty.ts'

export interface FileSystemEntry {
  readonly name: string
  readonly type: number
}

const isFileSystemEntry = (entry: Readonly<FileSystemEntry> | undefined): entry is FileSystemEntry => !!entry

export const parseEntries = (value: unknown): readonly FileSystemEntry[] => {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .map((entry) => {
      if (Array.isArray(entry) && typeof entry[0] === 'string' && typeof entry[1] === 'number') {
        return {
          name: entry[0],
          type: entry[1],
        }
      }
      const name = getObjectProperty(entry, 'name')
      const type = getObjectProperty(entry, 'type')
      if (typeof name === 'string' && typeof type === 'number') {
        return {
          name,
          type,
        }
      }
      return undefined
    })
    .filter(isFileSystemEntry)
}
