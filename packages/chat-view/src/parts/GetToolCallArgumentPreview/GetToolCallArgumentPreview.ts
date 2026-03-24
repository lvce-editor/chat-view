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
