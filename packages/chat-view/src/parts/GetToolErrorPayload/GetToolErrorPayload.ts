import { getObjectProperty } from '../GetObjectProperty/GetObjectProperty.ts'

export const getToolErrorPayload = (error: unknown): { readonly error: string; readonly errorStack?: string; readonly stack?: string } => {
  const rawStack = getObjectProperty(error, 'stack')
  return {
    error: String(error),
    ...(typeof rawStack === 'string' && rawStack.trim()
      ? {
          errorStack: rawStack,
          stack: rawStack,
        }
      : {}),
  }
}
