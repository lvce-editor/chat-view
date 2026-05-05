import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockOpenApiStream from '../MockOpenApiStream/MockOpenApiStream.ts'

export const mockOpenApiStreamFinish = (state: ChatState, requestId?: string): ChatState => {
  MockOpenApiStream.finish(requestId)
  void ChatCoordinatorWorker.invoke('ChatCoordinator.mockOpenApiStreamFinish', requestId)
  return state
}
