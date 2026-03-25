import type { ChatState } from '../ChatState/ChatState.ts'

const defaultMockApiCommandId = 'ChatE2e.mockApi'

 
export const useMockApi = (state: ChatState, value: boolean, mockApiCommandId: string = defaultMockApiCommandId): ChatState => {
  if (!value) {
    return {
      ...state,
      useMockApi: false,
    }
  }
  return {
    ...state,
    mockApiCommandId,
    useMockApi: true,
  }
}
