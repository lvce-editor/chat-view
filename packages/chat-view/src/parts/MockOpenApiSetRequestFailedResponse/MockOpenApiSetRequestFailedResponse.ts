import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const mockOpenApiSetRequestFailedResponse = (state: ChatState, isOffline: boolean = false): ChatState => {
  MockOpenApiStream.setRequestFailedResponse(isOffline)
  return state
}
