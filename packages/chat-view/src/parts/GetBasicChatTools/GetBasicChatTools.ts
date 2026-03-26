import type { ToolEnablement } from '../ToolEnablement/ToolEnablement.ts'
import type { ChatTool } from '../Types/Types.ts'
import { defaultAgentMode, type AgentMode } from '../AgentMode/AgentMode.ts'
import * as ChatToolRequest from '../ChatToolRequest/ChatToolRequest.ts'
import { filterEnabledTools } from '../ToolEnablement/ToolEnablement.ts'

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

const readOnlyToolNames = new Set(['get_workspace_uri', 'list_file', 'list_files', 'read_file'])

const withAgentMode = (tools: readonly ChatTool[], agentMode: AgentMode): readonly ChatTool[] => {
  if (agentMode === 'agent') {
    return tools
  }
  return tools.filter((tool) => readOnlyToolNames.has(tool.function.name))
}

export const getBasicChatTools = async (
  agentMode: AgentMode | boolean = defaultAgentMode,
  questionToolEnabled = false,
  toolEnablement?: ToolEnablement,
): Promise<readonly ChatTool[]> => {
  const effectiveAgentMode = typeof agentMode === 'boolean' ? defaultAgentMode : agentMode
  const effectiveQuestionToolEnabled = typeof agentMode === 'boolean' ? agentMode : questionToolEnabled
  try {
    return withAgentMode(
      filterEnabledTools(withQuestionTool(await ChatToolRequest.getTools(), effectiveQuestionToolEnabled), toolEnablement),
      effectiveAgentMode,
    )
  } catch {
    return withAgentMode(filterEnabledTools(withQuestionTool([], effectiveQuestionToolEnabled), toolEnablement), effectiveAgentMode)
  }
}
