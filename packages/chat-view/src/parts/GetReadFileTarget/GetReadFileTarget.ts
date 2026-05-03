/* cspell:ignore sonarjs */

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
  const baseUri = Reflect.get(parsed, 'baseUri')
  const uriValue = typeof uri === 'string' ? uri : ''
  const pathValue = typeof path === 'string' ? path : ''
  const baseUriValue = typeof baseUri === 'string' ? baseUri : ''
  const title = uriValue || pathValue || baseUriValue
  if (!title) {
    return undefined
  }
  // File-like tool calls use absolute `uri` where available; keep `path` as a legacy fallback.
  const clickableUri = uriValue || pathValue || baseUriValue
  return {
    clickableUri,
    title,
  }
}
