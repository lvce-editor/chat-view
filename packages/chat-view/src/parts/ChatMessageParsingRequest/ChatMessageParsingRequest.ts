import { ChatMessageParsingWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'

export const parseAndStoreMessagesContent = async (
  parsedMessages: readonly ParsedMessage[],
  messages: readonly ChatMessage[],
): Promise<readonly ParsedMessage[]> => {
  return ChatMessageParsingWorker.invoke('ChatMessageParsing.parseAndStoreMessagesContent', parsedMessages, messages) as Promise<
    readonly ParsedMessage[]
  >
}
