import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

export const mockOpenApiStreamPushChunk = async (state: ChatState, chunkOrRequestId: string, chunk?: string): Promise<ChatState> => {
  if (typeof chunk === 'string') {
    MockOpenApiStream.pushChunk(chunk, chunkOrRequestId)
    await ChatCoordinatorWorker.invoke('ChatCoordinator.mockOpenApiStreamPushChunk', chunk, chunkOrRequestId)
    return state
  }
  MockOpenApiStream.pushChunk(chunkOrRequestId)
  await ChatCoordinatorWorker.invoke('ChatCoordinator.mockOpenApiStreamPushChunk', chunkOrRequestId)
  return state
}
