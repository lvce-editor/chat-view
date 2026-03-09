import type { ChatTool } from '../Types/Types.ts'

const getReadFileTool = (): ChatTool => {
  return {
    function: {
      description: 'Read UTF-8 text content from a file inside the currently open workspace folder. Only pass an absolute URI.',
      name: 'read_file',
      parameters: {
        additionalProperties: false,
        properties: {
          uri: {
            description: 'Absolute file URI within the workspace (for example: file:///workspace/src/index.ts).',
            type: 'string',
          },
        },
        required: ['uri'],
        type: 'object',
      },
    },
    type: 'function',
  }
}

const getWriteFileTool = (): ChatTool => {
  return {
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
  }
}

const getListFilesTool = (): ChatTool => {
  return {
    function: {
      description: 'List direct children (files and folders) for a folder URI inside the currently open workspace folder. Only pass an absolute URI.',
      name: 'list_files',
      parameters: {
        additionalProperties: false,
        properties: {
          uri: {
            description: 'Absolute folder URI within the workspace (for example: file:///workspace/src).',
            type: 'string',
          },
        },
        required: ['uri'],
        type: 'object',
      },
    },
    type: 'function',
  }
}

const getGetWorkspaceUriTool = (): ChatTool => {
  return {
    function: {
      description: 'Get the URI of the currently open workspace folder.',
      name: 'getWorkspaceUri',
      parameters: {
        additionalProperties: false,
        properties: {},
        type: 'object',
      },
    },
    type: 'function',
  }
}

export const getBasicChatTools = (): readonly ChatTool[] => {
  return [getReadFileTool(), getWriteFileTool(), getListFilesTool(), getGetWorkspaceUriTool()]
}
