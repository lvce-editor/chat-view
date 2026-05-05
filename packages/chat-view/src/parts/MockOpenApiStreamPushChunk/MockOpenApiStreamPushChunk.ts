import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

export const mockOpenApiStreamPushChunk = (state: ChatState, chunkOrRequestId: string, chunk?: string): ChatState => {
  if (typeof chunk === 'string') {
    MockOpenApiStream.pushChunk(chunk, chunkOrRequestId)
    return state
  }
  MockOpenApiStream.pushChunk(chunkOrRequestId)
  return state
}
