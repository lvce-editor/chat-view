import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

export const mockOpenApiSetRequestFailedResponse = (state: ChatState, isOffline: boolean = false): ChatState => {
  MockOpenApiStream.setRequestFailedResponse(isOffline)
  return state
}
