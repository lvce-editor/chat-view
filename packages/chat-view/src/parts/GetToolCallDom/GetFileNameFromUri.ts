export const getFileNameFromUri = (uri: string): string => {
  const stripped = uri.replace(/[?#].*$/, '').replace(/\/$/, '')
  const slashIndex = Math.max(stripped.lastIndexOf('/'), stripped.lastIndexOf('\\\\'))
  const fileName = slashIndex === -1 ? stripped : stripped.slice(slashIndex + 1)
  return fileName || uri
}
