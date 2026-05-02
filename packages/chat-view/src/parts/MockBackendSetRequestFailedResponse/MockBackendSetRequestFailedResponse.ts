import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockBackendCompletion from '../MockBackendCompletion/MockBackendCompletion.ts'

export const mockBackendSetRequestFailedResponse = (
  state: ChatState,
  errorMessage?: string,
  errorCode: string = 'network_error',
): ChatState => {
  MockBackendCompletion.setRequestFailedResponse(errorMessage, errorCode)
  return state
}