import { isAbsoluteFileUri } from './isAbsoluteFileUri'

export const toFileUri = (value: string): string => {
  if (!value) {
    return ''
  }
  if (isAbsoluteFileUri(value)) {
    return value
  }
  if (/^[a-zA-Z]:[\\/]/.test(value)) {
    const withForwardSlashes = value.replaceAll('\\', '/')
    return `file:///${encodeURI(withForwardSlashes)}`
  }
  if (value.startsWith('/')) {
    return `file://${encodeURI(value)}`
  }
  return ''
}
