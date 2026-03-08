import type { ToolArgumentSchema } from './types.ts'

export const toolArgumentSchemas: Readonly<Record<string, ToolArgumentSchema>> = {
  list_files: {
    additionalProperties: false,
    properties: {
      path: 'string',
    },
    required: [],
  },
  read_file: {
    additionalProperties: false,
    properties: {
      path: 'string',
    },
    required: ['path'],
  },
  write_file: {
    additionalProperties: false,
    properties: {
      content: 'string',
      path: 'string',
    },
    required: ['path', 'content'],
  },
}
