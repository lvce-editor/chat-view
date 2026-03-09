export const getReadFileTarget = (rawArguments: string): { readonly title: string; readonly clickableUri: string } | undefined => {
  let parsed: unknown
  try {
    parsed = JSON.parse(rawArguments)
  } catch {
    return undefined
  }
  if (!parsed || typeof parsed !== 'object') {
    return undefined
  }
  const uri = Reflect.get(parsed, 'uri')
  const path = Reflect.get(parsed, 'path')
  const uriValue = typeof uri === 'string' ? uri : ''
  const pathValue = typeof path === 'string' ? path : ''
  const title = uriValue || pathValue
  if (!title) {
    return undefined
  }
  // `read_file` tool calls usually provide a relative `path`; pass it through so UI clicks can open the file.
  const clickableUri = uriValue || pathValue
  return {
    clickableUri,
    title,
  }
}
