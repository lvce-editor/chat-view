export const toFileSystemPath = (uri: string): string => {
  if (!uri.startsWith('file://')) {
    return uri
  }
  return decodeURIComponent(new URL(uri).pathname)
}
