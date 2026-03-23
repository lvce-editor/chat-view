import type { ChatTool } from '../Types/Types.ts'
import * as ChatToolRequest from '../ChatToolRequest/ChatToolRequest.ts'

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

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const getBasicChatTools = async (questionToolEnabled = false): Promise<readonly ChatTool[]> => {
  try {
    return withQuestionTool(await ChatToolRequest.getTools(), questionToolEnabled)
  } catch {
    return withQuestionTool([], questionToolEnabled)
  }
}
