export const getRelativePath = (fromPath: string, toPath: string): string => {
  if (!fromPath.startsWith('/') || !toPath.startsWith('/')) {
    return toPath
  }
  const fromParts = fromPath.split('/').filter(Boolean)
  const toParts = toPath.split('/').filter(Boolean)
  let commonPrefixLength = 0
  while (
    commonPrefixLength < fromParts.length &&
    commonPrefixLength < toParts.length &&
    fromParts[commonPrefixLength] === toParts[commonPrefixLength]
  ) {
    commonPrefixLength++
  }
  const parentSegments = fromParts.slice(commonPrefixLength).map(() => '..')
  const childSegments = toParts.slice(commonPrefixLength)
  return [...parentSegments, ...childSegments].join('/') || '.'
}
