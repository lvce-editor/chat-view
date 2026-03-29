import { ChatMessageParsingWorker } from '@lvce-editor/rpc-registry'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

const toParsedContent = (rawMessage: string): readonly MessageIntermediateNode[] => {
  return [
    {
      children: [
        {
          text: rawMessage,
          type: 'text',
        },
      ],
      type: 'text',
    },
  ]
}

export const registerMockChatMessageParsingRpc = (): ReturnType<typeof ChatMessageParsingWorker.registerMockRpc> => {
  return ChatMessageParsingWorker.registerMockRpc({
    'ChatMessageParsing.parseMessageContent': async (rawMessage: string) => toParsedContent(rawMessage),
    'ChatMessageParsing.parseMessageContents': async (rawMessages: readonly string[]) => rawMessages.map(toParsedContent),
  })
}
