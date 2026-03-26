import type { ChatTool } from '../Types/Types.ts'

export type ToolEnablement = Readonly<Record<string, boolean>>

export const parseToolEnablement = (value: unknown): ToolEnablement => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }
  const toolEnablement: Record<string, boolean> = {}
  for (const [key, enabled] of Object.entries(value)) {
    if (typeof enabled === 'boolean') {
      toolEnablement[key] = enabled
    }
  }
  return toolEnablement
}

export const validateToolEnablement = (value: unknown): ToolEnablement => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new TypeError('Tool enablement must be an object map of tool names to booleans.')
  }
  const toolEnablement: Record<string, boolean> = {}
  for (const [key, enabled] of Object.entries(value)) {
    if (typeof enabled !== 'boolean') {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw new TypeError(`Tool enablement for "${key}" must be a boolean.`)
    }
    toolEnablement[key] = enabled
  }
  return toolEnablement
}

export const isToolEnabled = (toolEnablement: ToolEnablement | undefined, toolName: string): boolean => {
  if (!toolEnablement) {
    return true
  }
  const enabled = toolEnablement[toolName]
  return typeof enabled === 'boolean' ? enabled : true
}

export const filterEnabledTools = (tools: readonly ChatTool[], toolEnablement: ToolEnablement | undefined): readonly ChatTool[] => {
  return tools.filter((tool) => isToolEnabled(toolEnablement, tool.function.name))
}
