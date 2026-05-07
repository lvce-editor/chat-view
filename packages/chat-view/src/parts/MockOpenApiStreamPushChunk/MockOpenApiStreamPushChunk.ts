import type { ChatState } from '../ChatState/ChatState.ts'
import * as CoordinatorMockResponse from '../CoordinatorMockResponse/CoordinatorMockResponse.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

export const mockOpenApiStreamPushChunk = async (state: ChatState, chunkOrRequestId: string, chunk?: string): Promise<ChatState> => {
  if (typeof chunk === 'string') {
    MockOpenApiStream.pushChunk(chunk, chunkOrRequestId)
    CoordinatorMockResponse.pushChunk(chunk, chunkOrRequestId)
    return state
  }
  MockOpenApiStream.pushChunk(chunkOrRequestId)
  CoordinatorMockResponse.pushChunk(chunkOrRequestId)
  return state
}
