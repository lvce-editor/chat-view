/* cspell:ignore sonarjs */

/* eslint-disable sonarjs/cognitive-complexity */

export const getToolCallArgumentPreview = (rawArguments: string): string => {
  if (!rawArguments.trim()) {
    return '""'
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(rawArguments) as unknown
  } catch {
    return rawArguments
  }
  if (!parsed || typeof parsed !== 'object') {
    return rawArguments
  }
  const command = Reflect.get(parsed, 'command')
  if (typeof command === 'string') {
    return `"${command}"`
  }
  const options = Reflect.get(parsed, 'options')
  if (options && typeof options === 'object') {
    const optionsCommand = Reflect.get(options, 'command')
    if (typeof optionsCommand === 'string') {
      return `"${optionsCommand}"`
    }
  }
  const query = Reflect.get(parsed, 'query')
  if (typeof query === 'string') {
    return `"${query}"`
  }
  const nestedArguments = Reflect.get(parsed, 'arguments')
  if (nestedArguments && typeof nestedArguments === 'object' && !Array.isArray(nestedArguments)) {
    const nestedQuery = Reflect.get(nestedArguments, 'query')
    if (typeof nestedQuery === 'string') {
      return `"${nestedQuery}"`
    }
  }
  const path = Reflect.get(parsed, 'path')
  if (typeof path === 'string') {
    return `"${path}"`
  }
  const keys = Object.keys(parsed)
  if (keys.length === 1) {
    const value = Reflect.get(parsed, keys[0])
    if (typeof value === 'string') {
      return `"${value}"`
    }
  }
  return rawArguments
}
