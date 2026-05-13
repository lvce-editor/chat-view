export const stringifyToolOutput = (output: unknown): string => {
  if (typeof output === 'string') {
    return output
  }
  return JSON.stringify(output) ?? 'null'
}
