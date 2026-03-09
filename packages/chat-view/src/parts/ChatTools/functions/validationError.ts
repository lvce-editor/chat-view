export const validationError = (message: string): string => {
  return JSON.stringify({ error: `Validation error: ${message}` })
}
