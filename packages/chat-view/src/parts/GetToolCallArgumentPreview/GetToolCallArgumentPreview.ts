/* cspell:ignore sonarjs */

import { getObjectProperty } from '../GetObjectProperty/GetObjectProperty.ts'

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
  const command = getObjectProperty(parsed, 'command')
  if (typeof command === 'string') {
    return `"${command}"`
  }
  const options = getObjectProperty(parsed, 'options')
  if (options && typeof options === 'object') {
    const optionsCommand = getObjectProperty(options, 'command')
    if (typeof optionsCommand === 'string') {
      return `"${optionsCommand}"`
    }
  }
  const query = getObjectProperty(parsed, 'query')
  if (typeof query === 'string') {
    return `"${query}"`
  }
  const nestedArguments = getObjectProperty(parsed, 'arguments')
  if (nestedArguments && typeof nestedArguments === 'object' && !Array.isArray(nestedArguments)) {
    const nestedQuery = getObjectProperty(nestedArguments, 'query')
    if (typeof nestedQuery === 'string') {
      return `"${nestedQuery}"`
    }
  }
  const path = getObjectProperty(parsed, 'path')
  if (typeof path === 'string') {
    return `"${path}"`
  }
  const keys = Object.keys(parsed)
  if (keys.length === 1) {
    const value = getObjectProperty(parsed, keys[0])
    if (typeof value === 'string') {
      return `"${value}"`
    }
  }
  return rawArguments
}
