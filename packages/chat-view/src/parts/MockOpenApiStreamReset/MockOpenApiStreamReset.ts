import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as CoordinatorMockResponse from '../CoordinatorMockResponse/CoordinatorMockResponse.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

export const mockOpenApiStreamReset = async (state: ChatState, requestId?: string): Promise<ChatState> => {
  MockOpenApiStream.reset(requestId)
  CoordinatorMockResponse.reset(requestId)
  return state
}
