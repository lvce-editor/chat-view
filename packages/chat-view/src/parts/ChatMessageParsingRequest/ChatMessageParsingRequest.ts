import { ChatMessageParsingWorker } from '@lvce-editor/rpc-registry'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

export const parseMessageContent = async (rawMessage: string): Promise<readonly MessageIntermediateNode[]> => {
  return ChatMessageParsingWorker.invoke('ChatParser.parseMessageContent', rawMessage) as Promise<readonly MessageIntermediateNode[]>
}

export const parseMessageContents = async (rawMessages: readonly string[]): Promise<readonly (readonly MessageIntermediateNode[])[]> => {
  return ChatMessageParsingWorker.invoke('ChatParser.parseMessageContents', rawMessages) as Promise<readonly (readonly MessageIntermediateNode[])[]>
}
