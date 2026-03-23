import type { ChatState } from '../ChatState/ChatState.ts'
import { withClearedComposer } from '../WithClearedComposer/WithClearedComposer.ts'
import { getSlashCommandHandler } from './SlashCommandRegistry/SlashCommandRegistry.ts'

export const executeSlashCommand = async (state: ChatState, command: string): Promise<ChatState> => {
  const slashCommandHandler = getSlashCommandHandler(command)
  if (!slashCommandHandler) {
    return withClearedComposer(state)
  }
  return slashCommandHandler(state)
}
