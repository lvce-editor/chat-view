import { ChatCoordinatorWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

interface MockResponse {
  readonly text: string
}

export const registerMockResponse = async (state: ChatState, mockResponse: MockResponse): Promise<ChatState> => {
  await ChatCoordinatorWorker.invoke('ChatCoordinator.registerMockResponse', mockResponse)
  return state
}
