import { withClearedComposer } from '../WithClearedComposer/WithClearedComposer.ts'

import type { ChatState } from '../ChatState/ChatState.ts'

export type SlashCommandHandler = (state: ChatState) => Promise<ChatState>

const slashCommandRegistry: Record<string, SlashCommandHandler> = Object.create(null)

export const registerSlashCommand = (command: string, handler: SlashCommandHandler): void => {
  slashCommandRegistry[command] = handler
}

export const clearSlashCommands = (): void => {
  for (const command of Object.keys(slashCommandRegistry)) {
    delete slashCommandRegistry[command]
  }
}

export const hasSlashCommand = (command: string): boolean => {
  return command in slashCommandRegistry
}

export const executeSlashCommand = async (state: ChatState, command: string): Promise<ChatState> => {
  const slashCommandHandler = slashCommandRegistry[command]
  if (!slashCommandHandler) {
    return withClearedComposer(state)
  }
  return slashCommandHandler(state)
}
