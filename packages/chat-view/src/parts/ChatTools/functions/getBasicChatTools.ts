import type { ChatTool } from '../types'

export const getBasicChatTools = (): readonly ChatTool[] => {
  return [
    {
      function: {
        description: 'Get the absolute file URI for the currently open workspace folder root.',
        name: 'get_current_workspace_uri',
        parameters: {
          additionalProperties: false,
          properties: {},
          type: 'object',
        },
      },
      type: 'function',
    },
    {
      function: {
        description:
          'Read UTF-8 text content from a file inside the currently open workspace folder. Requires an absolute file URI. Use get_current_workspace_uri first and then append the relative file path.',
        name: 'read_file',
        parameters: {
          additionalProperties: false,
          properties: {
            uri: {
              description:
                'Absolute file URI for a file inside the current workspace (for example: file:///workspace/src/index.ts). Do not pass a bare filename like package.json.',
              type: 'string',
            },
          },
          required: ['uri'],
          type: 'object',
        },
      },
      type: 'function',
    },
    {
      function: {
        description: 'Write UTF-8 text content to a file inside the currently open workspace folder.',
        name: 'write_file',
        parameters: {
          additionalProperties: false,
          properties: {
            content: {
              description: 'New UTF-8 text content to write to the file.',
              type: 'string',
            },
            path: {
              description: 'Relative file path within the workspace (for example: src/index.ts).',
              type: 'string',
            },
          },
          required: ['path', 'content'],
          type: 'object',
        },
      },
      type: 'function',
    },
    {
      function: {
        description: 'List direct children (files and folders) for a folder inside the currently open workspace folder.',
        name: 'list_files',
        parameters: {
          additionalProperties: false,
          properties: {
            path: {
              description: 'Relative folder path within the workspace. Use "." for the workspace root.',
              type: 'string',
            },
          },
          type: 'object',
        },
      },
      type: 'function',
    },
  ]
}
