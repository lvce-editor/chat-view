import { ChatMessageParsingWorker } from '@lvce-editor/rpc-registry'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

<<<<<<< HEAD
export const parseMessageContent = async (rawMessage: string): Promise<readonly MessageIntermediateNode[]> => {
  return ChatMessageParsingWorker.invoke('ChatMessageParsing.parseMessageContent', rawMessage) as Promise<readonly MessageIntermediateNode[]>
}

export const parseMessageContents = async (rawMessages: readonly string[]): Promise<readonly (readonly MessageIntermediateNode[])[]> => {
  return ChatMessageParsingWorker.invoke('ChatMessageParsing.parseMessageContents', rawMessages) as Promise<
    readonly (readonly MessageIntermediateNode[])[]
  >
=======
export const parseAndStoreMessagesContent = async (
  parsedMessages: readonly ParsedMessage[],
  messages: readonly ChatMessage[],
): Promise<readonly ParsedMessage[]> => {
  return ChatMessageParsingWorker.invoke('ChatParser.parseMessageContent', parsedMessages, messages) as Promise<readonly ParsedMessage[]>
>>>>>>> origin/main
}
