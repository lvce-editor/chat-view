const RE_QUERY_OR_HASH = /[?#].*$/
const RE_TRAILING_SLASH = /\/$/

export const getFileNameFromUri = (uri: string): string => {
  const stripped = uri.replace(RE_QUERY_OR_HASH, '').replace(RE_TRAILING_SLASH, '')
  const slashIndex = Math.max(stripped.lastIndexOf('/'), stripped.lastIndexOf('\\\\'))
  const fileName = slashIndex === -1 ? stripped : stripped.slice(slashIndex + 1)
  return fileName || uri
}
