import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockBackendCompletion from '../MockBackendCompletion/MockBackendCompletion.ts'

export const mockBackendSetHttpErrorResponse = (state: ChatState, statusCode: number, body: unknown): ChatState => {
  MockBackendCompletion.setHttpErrorResponse(statusCode, body)
  void ChatCoordinatorWorker.invoke('ChatCoordinator.mockBackendSetHttpErrorResponse', statusCode, body)
  return state
}
