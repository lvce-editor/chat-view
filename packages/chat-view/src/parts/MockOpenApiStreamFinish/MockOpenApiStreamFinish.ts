import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as CoordinatorMockResponse from '../CoordinatorMockResponse/CoordinatorMockResponse.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

export const mockOpenApiStreamFinish = async (state: ChatState, requestId?: string): Promise<ChatState> => {
  MockOpenApiStream.finish(requestId)
  const text = CoordinatorMockResponse.consumeResponseText(requestId)
  await ChatCoordinatorWorker.invoke('ChatCoordinator.registerMockResponse', { text })
  return state
}
