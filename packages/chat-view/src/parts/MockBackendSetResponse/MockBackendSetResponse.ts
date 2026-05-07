import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockBackendCompletion from '../MockBackendCompletion/MockBackendCompletion.ts'

export const mockBackendSetResponse = (state: ChatState, body: unknown): ChatState => {
  MockBackendCompletion.setResponse(body)
  void ChatCoordinatorWorker.invoke('ChatCoordinator.mockBackendSetResponse', body)
  return state
}
