export const decodeFileContent = (content: unknown): string => {
  if (typeof content === 'string') {
    return content
  }
  if (content instanceof Uint8Array) {
    return new TextDecoder().decode(content)
  }
  if (Array.isArray(content)) {
    return new TextDecoder().decode(new Uint8Array(content))
  }
  return ''
}
