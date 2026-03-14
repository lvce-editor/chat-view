const isCompleteJson = (value: string): boolean => {
  const trimmed = value.trim()
  if (!trimmed) {
    return false
  }
  let depth = 0
  let inString = false
  let escaped = false
  for (const char of trimmed) {
    if (inString) {
      if (escaped) {
        escaped = false
        continue
      }
      if (char === '\\') {
        escaped = true
        continue
      }
      if (char === '"') {
        inString = false
      }
      continue
    }
    if (char === '"') {
      inString = true
      continue
    }
    if (char === '{' || char === '[') {
      depth += 1
      continue
    }
    if (char === '}' || char === ']') {
      depth -= 1
      if (depth < 0) {
        return false
      }
    }
  }
  return depth === 0 && !inString && !escaped
}

export const getReadFileTarget = (rawArguments: string): { readonly title: string; readonly clickableUri: string } | undefined => {
  // Tool arguments stream in chunks, so skip parsing until a full JSON payload is available.
  if (!isCompleteJson(rawArguments)) {
    return undefined
  }
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
  // `read_file` tool calls now use absolute `uri`; keep `path` as a legacy fallback for old transcripts.
  const clickableUri = uriValue || pathValue
  return {
    clickableUri,
    title,
  }
}
