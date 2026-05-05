import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

export const mockOpenApiStreamPushChunk = (state: ChatState, chunkOrRequestId: string, chunk?: string): ChatState => {
  if (typeof chunk === 'string') {
    MockOpenApiStream.pushChunk(chunk, chunkOrRequestId)
    void ChatCoordinatorWorker.invoke('ChatCoordinator.mockOpenApiStreamPushChunk', chunk, chunkOrRequestId)
    return state
  }
  MockOpenApiStream.pushChunk(chunkOrRequestId)
  void ChatCoordinatorWorker.invoke('ChatCoordinator.mockOpenApiStreamPushChunk', chunkOrRequestId)
  return state
}
