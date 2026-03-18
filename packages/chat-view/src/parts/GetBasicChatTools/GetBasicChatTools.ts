import type { ChatTool } from '../Types/Types.ts'
import * as ChatToolRequest from '../ChatToolRequest/ChatToolRequest.ts'

const getReadFileTool = (): ChatTool => {
  return {
    function: {
      description:
        'Read UTF-8 text content from a file inside the currently open workspace folder. Only pass an absolute URI. When you reference files in your response, use markdown links like [index.ts](vscode-references:///workspace/src/index.ts).',
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

const getRenderHtmlTool = (): ChatTool => {
  return {
    function: {
      description:
        'Render custom HTML and optional CSS directly in the chat tool call list using native chat UI rendering. Use this for structured cards, tables, and small dashboards. After calling this tool, do not repeat the same HTML, data table, or long content again as plain text unless the user explicitly asks for a text-only version.',
      name: 'render_html',
      parameters: {
        additionalProperties: false,
        properties: {
          css: {
            description: 'Optional CSS string applied inside the preview document.',
            type: 'string',
          },
          html: {
            description: 'HTML string to render in the preview document.',
            type: 'string',
          },
          title: {
            description: 'Optional short title for the preview.',
            type: 'string',
          },
        },
        required: ['html'],
        type: 'object',
      },
    },
    type: 'function',
  }
}

const getAskQuestionTool = (): ChatTool => {
  return {
    function: {
      description:
        'Ask the user a multiple-choice question in the chat UI. Use this when you need a user decision before continuing. Provide short answer options.',
      name: 'ask_question',
      parameters: {
        additionalProperties: false,
        properties: {
          answers: {
            description: 'List of answer options shown to the user.',
            items: {
              type: 'string',
            },
            type: 'array',
          },
          question: {
            description: 'The question text shown to the user.',
            type: 'string',
          },
        },
        required: ['question', 'answers'],
        type: 'object',
      },
    },
    type: 'function',
  }
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const withQuestionTool = (tools: readonly ChatTool[], questionToolEnabled: boolean): readonly ChatTool[] => {
  if (!questionToolEnabled) {
    return tools
  }
  for (const tool of tools) {
    if (tool.function.name === 'ask_question') {
      return tools
    }
  }
  return [...tools, getAskQuestionTool()]
}

export const getBasicChatTools = async (questionToolEnabled = false): Promise<readonly ChatTool[]> => {
  const fallbackTools = [getReadFileTool(), getWriteFileTool(), getListFilesTool(), getGetWorkspaceUriTool(), getRenderHtmlTool()]
  try {
    return withQuestionTool(await ChatToolRequest.getTools(), questionToolEnabled)
  } catch {
    return withQuestionTool(fallbackTools, questionToolEnabled)
  }
}
