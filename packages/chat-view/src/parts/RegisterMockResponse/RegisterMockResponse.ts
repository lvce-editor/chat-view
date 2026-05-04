import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

interface MockResponse {
  readonly text: string
}

export const registerMockResponse = (state: ChatState, mockResponse: MockResponse): ChatState => {
  void ChatCoordinatorWorker.invoke('ChatCoordinator.registerMockResponse', mockResponse)
  return state
}
