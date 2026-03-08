import * as ToolArgumentSchemas from './ToolArgumentSchemas.ts'
import type { VerifyToolArgumentsResult } from './types.ts'

export const verifyToolCallArguments = (name: string, args: Record<string, unknown>): VerifyToolArgumentsResult => {
  const schema = ToolArgumentSchemas.toolArgumentSchemas[name]
  if (!schema) {
    return {
      message: `Unknown tool: ${name}`,
      type: 'error',
    }
  }

  for (const requiredKey of schema.required) {
    if (!(requiredKey in args)) {
      return {
        message: `Missing required argument: ${requiredKey}`,
        type: 'error',
      }
    }
  }

  for (const [key, value] of Object.entries(args)) {
    const expectedType = schema.properties[key]
    if (!expectedType) {
      if (schema.additionalProperties) {
        continue
      }
      return {
        message: `Unexpected argument: ${key}`,
        type: 'error',
      }
    }

    if (typeof value !== expectedType) {
      return {
        message: `Invalid argument type for ${key}: expected ${expectedType}`,
        type: 'error',
      }
    }
  }

  return {
    type: 'success',
    value: args,
  }
}
