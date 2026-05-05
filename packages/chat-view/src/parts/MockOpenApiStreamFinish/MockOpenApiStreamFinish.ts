import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

export const mockOpenApiStreamFinish = (state: ChatState, requestId?: string): ChatState => {
  MockOpenApiStream.finish(requestId)
  return state
}
