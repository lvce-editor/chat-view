export type ToolEnablement = Readonly<Record<string, boolean>>

const defaultToolEnablement: ToolEnablement = {
  run_in_terminal: false,
}

export const parseToolEnablement = (value: unknown): ToolEnablement => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaultToolEnablement
  }
  const toolEnablement: Record<string, boolean> = { ...defaultToolEnablement }
  for (const [key, enabled] of Object.entries(value)) {
    if (typeof enabled === 'boolean') {
      toolEnablement[key] = enabled
    }
  }
  return toolEnablement
}