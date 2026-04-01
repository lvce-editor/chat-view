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
      if (entry && typeof entry === 'object' && typeof Reflect.get(entry, 'name') === 'string' && typeof Reflect.get(entry, 'type') === 'number') {
        return {
          name: Reflect.get(entry, 'name'),
          type: Reflect.get(entry, 'type'),
        }
      }
      return undefined
    })
    .filter(isFileSystemEntry)
}
