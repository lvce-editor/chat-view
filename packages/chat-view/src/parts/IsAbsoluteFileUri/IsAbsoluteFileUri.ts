export const isAbsoluteFileUri = (value: string): boolean => {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'file:'
  } catch {
    return false
  }
}
