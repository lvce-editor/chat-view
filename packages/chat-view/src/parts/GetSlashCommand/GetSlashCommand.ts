const slashCommandRegex = /^\/(clear|export|help|new)(?:\s+.*)?$/

export const getSlashCommand = (value: string): 'clear' | 'export' | 'help' | 'new' | undefined => {
  const trimmed = value.trim()
  const match = trimmed.match(slashCommandRegex)
  if (!match) {
    return undefined
  }
  return match[1] as 'clear' | 'export' | 'help' | 'new'
}
