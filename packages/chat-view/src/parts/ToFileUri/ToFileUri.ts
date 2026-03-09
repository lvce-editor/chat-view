import { isAbsoluteFileUri } from '../IsAbsoluteFileUri/IsAbsoluteFileUri.ts'

export const toFileUri = (value: string): string => {
  if (!value) {
    return ''
  }
  if (isAbsoluteFileUri(value)) {
    return value
  }
  if (/^[a-zA-Z]:[\\/]/.test(value)) {
    const withForwardSlashes = value.replaceAll('\\\u005C', '/')
    return `file:///${encodeURI(withForwardSlashes)}`
  }
  if (value.startsWith('/')) {
    return `file://${encodeURI(value)}`
  }
  return ''
}
