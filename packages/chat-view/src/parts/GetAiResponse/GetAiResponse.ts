import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { GetAiResponseOptions } from '../GetAiResponseOptions/GetAiResponseOptions.ts'
import * as ChatCoordinatorRequest from '../ChatCoordinatorRequest/ChatCoordinatorRequest.ts'

export const getAiResponse = async (options: Readonly<GetAiResponseOptions>): Promise<ChatMessage> => {
  const result = await ChatCoordinatorRequest.getAiResponse(options)
  if (options.streamingEnabled) {
    if (options.onTextChunk) {
      await options.onTextChunk(result.text)
    }
    if (options.onEventStreamFinished) {
      await options.onEventStreamFinished()
    }
  }
  console.warn('ChatCoordinator.getAiResponse completed')
  return result
}
