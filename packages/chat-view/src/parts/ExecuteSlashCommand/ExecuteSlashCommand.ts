import type { ChatState } from '../ChatState/ChatState.ts'
import { getSlashCommandHandler } from '../SlashCommandRegistry/SlashCommandRegistry.ts'
import { withClearedComposer } from '../WithClearedComposer/WithClearedComposer.ts'

export const executeSlashCommand = async (state: ChatState, command: string): Promise<ChatState> => {
  const slashCommandHandler = getSlashCommandHandler(command)
  if (!slashCommandHandler) {
    return withClearedComposer(state)
  }
  return slashCommandHandler(state)
}
