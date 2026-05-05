import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

export const mockOpenApiStreamReset = (state: ChatState, requestId?: string): ChatState => {
  MockOpenApiStream.reset(requestId)
  return state
}
