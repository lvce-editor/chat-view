import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

interface MockResponse {
  readonly text: string
}

export const registerMockResponse = (state: ChatState, mockResponse: MockResponse): ChatState => {
  MockOpenApiStream.reset()
  MockOpenApiStream.pushChunk(mockResponse.text)
  MockOpenApiStream.finish()
  return state
}
