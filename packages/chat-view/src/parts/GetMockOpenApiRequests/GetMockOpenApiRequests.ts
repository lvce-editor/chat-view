import type { ChatState } from '../ChatState/ChatState.ts'
import type { MockOpenApiRequest } from '../MockOpenApiRequest/MockOpenApiRequest.ts'

export const getMockOpenApiRequests = (state: ChatState): readonly MockOpenApiRequest[] => {
  return state.mockOpenApiRequests
}
