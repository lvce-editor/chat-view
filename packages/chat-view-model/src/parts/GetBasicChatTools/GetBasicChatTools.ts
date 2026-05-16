import type { ToolEnablement } from '../ToolEnablement/ToolEnablement.ts'
import type { ChatTool } from '../Types/Types.ts'
import { defaultAgentMode, type AgentMode } from '../AgentMode/AgentMode.ts'
import * as ChatToolRequest from '../ChatToolRequest/ChatToolRequest.ts'
import { filterEnabledTools } from '../ToolEnablement/ToolEnablement.ts'

const readOnlyToolNames = new Set(['get_workspace_uri', 'list_file', 'list_files', 'read_file'])

const withAgentMode = (tools: readonly ChatTool[], agentMode: AgentMode): readonly ChatTool[] => {
  if (agentMode === 'agent') {
    return tools
  }
  return tools.filter((tool) => readOnlyToolNames.has(tool.function.name))
}

export const getBasicChatTools = async (
  agentMode: AgentMode = defaultAgentMode,
  toolEnablement?: ToolEnablement,
): Promise<readonly ChatTool[]> => {
  try {
    return withAgentMode(filterEnabledTools(await ChatToolRequest.getTools(), toolEnablement), agentMode)
  } catch {
    return withAgentMode(filterEnabledTools([], toolEnablement), agentMode)
  }
}